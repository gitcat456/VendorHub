from django.shortcuts import render
from rest_framework import viewsets 
from .serializers import VendorProfileSerializer, CategorySerializer, ProductImageSerializer, ProductSerializer
from .models import VendorProfile, Category, Product, ProductImage

class VendorProfileViewSet(viewsets.ModelViewSet):  
    queryset = VendorProfile.objects.all()
    serializer_class = VendorProfileSerializer

class CategoryViewSet(viewsets.ModelViewSet):  
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet): 
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.all()
        vendor_id = self.request.query_params.get('vendor', None)
        if vendor_id:
            queryset = queryset.filter(vendor_id=vendor_id)
        return queryset

class ProductImageViewSet(viewsets.ModelViewSet):  
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer