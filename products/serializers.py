from rest_framework import serializers
from .models import VendorProfile, Category, Product, ProductImage
from django.conf import settings  

class VendorProfileSerializer(serializers.ModelSerializer):  
    class Meta:
        model = VendorProfile
        fields = '__all__'
        read_only_fields = ['vendor'] 
        
    def create(self, validated_data):
        # Automatically set vendor to current logged-in user
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['vendor'] = request.user
        return super().create(validated_data)
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta: 
        model = Category
        fields = '__all__' 
        
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'
        

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    bss_name = serializers.CharField(source='vendor_profile.bss_name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'description', 'category',
            'category_name', 'bss_name', 'created_at', 'images'
        ]
        
    def create(self, validated_data):
        # Get the current user from request
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Request context is missing")
            
        user = request.user
        
        # Check if user has a vendor profile
        if not hasattr(user, 'vendor_profile'):
            # Create a vendor profile if it doesn't exist
            vendor_profile = VendorProfile.objects.create(
                vendor=user,
                bss_name=f"{user.username}'s Business",
                bss_location="Unknown"
            )
        else:
            vendor_profile = user.vendor_profile
        
        # Add vendor_profile to validated data
        validated_data['vendor_profile'] = vendor_profile
        
        # Create the product
        return super().create(validated_data)