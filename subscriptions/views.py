from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import SubscriptionPayment, VendorSubscription
from .mpesa_utils import get_mpesa_client
from datetime import timedelta
import json

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

        if not phone_number.isdigit() or len(phone_number) < 12:
            return Response(
                {"error": "Invalid phone number format."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate a unique provider reference (dummy for now)
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

        # Initiate STK push
        client = get_mpesa_client()
        stk_response = client.stk_push(
            amount=amount,
            phone_number=phone_number,
            account_reference=f"VendorHub-{user.id}",
            transaction_desc="Vendor subscription payment",
            callback_url=settings.MPESA_CALLBACK_URL
        )

        return Response({
            "success": True,
            "provider_reference": provider_reference,
            "mpesa_response": stk_response
        })

        

class MpesaWebhook(APIView):
    # M-Pesa will POST without auth
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        data = request.data  # M-Pesa sends JSON

        # Safaricom sends 'Body' -> 'stkCallback'
        callback = data.get("Body", {}).get("stkCallback", {})
        checkout_request_id = callback.get("CheckoutRequestID")
        result_code = callback.get("ResultCode")
        result_desc = callback.get("ResultDesc")

        try:
            payment = SubscriptionPayment.objects.get(provider_reference=checkout_request_id)
        except SubscriptionPayment.DoesNotExist:
            return Response({"error": "Payment not found"}, status=404)

        if result_code == 0:
            # Payment successful
            payment.status = "success"
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

        return Response({"success": True})