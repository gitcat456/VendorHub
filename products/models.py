from django.db import models
from django.conf import settings  

class VendorProfile(models.Model):
    bss_name = models.CharField(max_length=50)
    bss_location = models.CharField(max_length=100)  
    profile_pic = models.ImageField(upload_to='vendor_profiles/')
    vendor = models.OneToOneField(  
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='vendor_profile'
    )
    
    def __str__(self):
        return self.bss_name

class Category(models.Model):
    name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)  
    description = models.TextField()
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='products'  
    )
    vendor_profile = models.ForeignKey(
        VendorProfile, 
        on_delete=models.CASCADE,
        related_name='products'
    )
    created_at = models.DateTimeField(auto_now_add=True)  
    
    def __str__(self):
        return self.name

class ProductImage(models.Model):
    image = models.ImageField(upload_to='product_images/')  
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name='images'
    )
    
    def __str__(self):
        return f"Image for {self.product.name}"