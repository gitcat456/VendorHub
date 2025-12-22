from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import ContactClick
from products.models import Product

class LogContactClick(APIView):
    def post(self, request):
        product_id = request.data.get("product_id")
        contact_type = request.data.get("contact_type")

        if not product_id or not contact_type:
            return Response(
                {"error": "Missing data"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if contact_type not in ["call", "whatsapp"]:
            return Response({"error": "Invalid contact_type"}, status=status.HTTP_400_BAD_REQUEST)
        
        product = get_object_or_404(Product, id=product_id)
        vendor = product.vendor

        ip_address = request.META.get("HTTP_X_FORWARDED_FOR")
        if ip_address:
            ip_address = ip_address.split(",")[0]
        else:
            ip_address = request.META.get("REMOTE_ADDR")

        ContactClick.objects.create(
            product=product,
            vendor=vendor,
            contact_type=contact_type,
            ip_address=ip_address,
            user_agent=request.META.get("HTTP_USER_AGENT"),
        )

        return Response({"success": True}, status=status.HTTP_201_CREATED)
