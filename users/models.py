from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('vendor', 'Vendor'),
    )
    
    phone_number = models.CharField(max_length=15, unique=True, blank=False, null=False)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='vendor')
    profile_pic = models.ImageField(upload_to='vendor_profiles/', blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return self.username
    
    def is_admin(self):
        return self.role=='admin'
    
    def is_vendor(self):
        return self.role=='vendor'
    
    
