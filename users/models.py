from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('vendor', 'Vendor'),
    )
    
    phone_number = models.CharField(max_length=15)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='vendor')
    
    def __str__(self):
        return self.username
    
    def is_admin(self):
        return self.role=='admin'
    
    def is_vendor(self):
        return self.role=='vendor'
    
    
