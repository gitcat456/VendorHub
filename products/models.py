from django.db import models
from django.conf import settings  

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
    vendor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name="vendor_products"
    )
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)  
    created_at = models.DateTimeField(auto_now_add=True)  
    
    def __str__(self):
        return self.name

