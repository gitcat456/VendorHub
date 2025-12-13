from django.db import models
from django.contrib.auth import get_user_model
from products.models import Product

User = get_user_model()

class ContactClick(models.Model):
    CONTACT_CHOICES = (
        ("call", "Call"),
        ("whatsapp", "WhatsApp"),
    )

    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    vendor = models.ForeignKey(User, on_delete=models.CASCADE)
    contact_type = models.CharField(max_length=10, choices=CONTACT_CHOICES)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.contact_type} - {self.product.id}"
