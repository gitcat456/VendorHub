from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import SubscriptionPayment, VendorSubscription
from .mpesa_utils import get_mpesa_client
from datetime import timedelta
import json
from django.conf import settings
from django.utils import timezone

User = get_user_model()

class InitiateSubscriptionPayment(APIView):
    def post(self, request):
        user = request.user  
        amount = request.data.get("amount")
        phone_number = request.data.get("phone_number")
        
        if not amount or not phone_number:
            return Response(
                {"error": "Amount and phone number are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate phone number format (should be 254XXXXXXXXX)
        if not phone_number.startswith('254'):
            return Response(
                {"error": "Phone number must start with 254 (e.g., 254712345678)"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not phone_number.isdigit() or len(phone_number) != 12:
            return Response(
                {"error": "Invalid phone number format. Use format: 254712345678"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Unique provider reference
        import uuid
        provider_reference = str(uuid.uuid4())
        
        # Create pending SubscriptionPayment
        payment = SubscriptionPayment.objects.create(
            vendor=user,
            amount=amount,
            phone_number=phone_number,
            provider_reference=provider_reference,
            status="pending"
        )
        
        try:
            # Initiate STK push
            client = get_mpesa_client()
            
            # Minimal STK push call - let the library handle defaults
            stk_response = client.stk_push(
                phone_number=phone_number,
                amount=int(amount),
                #account_reference="SUB" + str(payment.id)[:8],  # Max 12 chars
                #transaction_desc="Payment",  # Max 13 chars
                callback_url=settings.MPESA_CALLBACK_URL,
                business_shortcode=settings.MPESA_SHORTCODE,
                #passkey=settings.MPESA_PASSKEY
            )
            
            # Update payment with checkout request ID from M-Pesa
            if 'CheckoutRequestID' in stk_response:
                payment.provider_reference = stk_response['CheckoutRequestID']
                payment.save()
            
            return Response({
                "success": True,
                "payment_id": payment.id,
                "provider_reference": payment.provider_reference,
                "mpesa_response": stk_response
            })
            
        except Exception as e:
            # Mark payment as failed
            payment.status = "failed"
            payment.save()
            
            return Response({
                "success": False,
                "error": str(e),
                "payment_id": payment.id
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MpesaWebhook(APIView):
    # M-Pesa will POST without auth
    authentication_classes = []
    permission_classes = []
    
    def post(self, request):
        data = request.data  # M-Pesa sends JSON
        
        # Log the incoming webhook data for debugging
        print("M-Pesa Webhook Data:", json.dumps(data, indent=2))
        
        # Safaricom sends 'Body' -> 'stkCallback'
        callback = data.get("Body", {}).get("stkCallback", {})
        checkout_request_id = callback.get("CheckoutRequestID")
        result_code = callback.get("ResultCode")
        result_desc = callback.get("ResultDesc")
        
        if not checkout_request_id:
            return Response({"error": "No CheckoutRequestID found"}, status=400)
        
        try:
            payment = SubscriptionPayment.objects.get(provider_reference=checkout_request_id)
        except SubscriptionPayment.DoesNotExist:
            return Response({"error": "Payment not found"}, status=404)
        
        if result_code == 0:
            # Payment successful
            payment.status = "success"
            
            # Extract transaction details from callback metadata
            callback_metadata = callback.get("CallbackMetadata", {}).get("Item", [])
            for item in callback_metadata:
                if item.get("Name") == "MpesaReceiptNumber":
                    payment.mpesa_receipt_number = item.get("Value")
                elif item.get("Name") == "Amount":
                    payment.amount = item.get("Value")
            
            payment.save()
            
            # Update or create vendor subscription
            subscription, created = VendorSubscription.objects.get_or_create(vendor=payment.vendor)
            subscription.status = "active"
            subscription.expires_at = timezone.now() + timedelta(days=30)  # 1 month subscription
            subscription.save()
            
        else:
            # Payment failed or cancelled
            payment.status = "failed"
            payment.save()
        
        return Response({
            "ResultCode": 0,
            "ResultDesc": "Accepted"
        })