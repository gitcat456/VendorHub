from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class VendorSubscription(models.Model):
    STATUS_CHOICES = (
        ("inactive", "Inactive"),
        ("active", "Active"),
        ("expired", "Expired"),
    )

    vendor = models.OneToOneField(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="inactive")
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_active(self):
        if self.expires_at and self.expires_at > timezone.now():
            return True
        return False

    def __str__(self):
        return f"{self.vendor.username} - {self.status}"


class SubscriptionPayment(models.Model):
    vendor = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    provider_reference = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    status = models.CharField(max_length=20, choices=(("pending", "Pending"), ("success", "Success"), ("failed", "Failed")))
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vendor.username} - {self.status} - {self.amount}"
