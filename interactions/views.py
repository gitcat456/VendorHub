from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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

        product = Product.objects.get(id=product_id)
        vendor = product.vendor

        ContactClick.objects.create(
            product=product,
            vendor=vendor,
            contact_type=contact_type,
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT"),
        )

        return Response({"success": True})
