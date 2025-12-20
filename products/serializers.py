from rest_framework import serializers
from django.utils.timesince import timesince
from django.contrib.auth import get_user_model
from .models import Product, Category

User = get_user_model()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class VendorSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'phone_number',
            'email',
            'profile_pic',
            'location',
        ]


# Product serializer
class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    vendor = VendorSerializer(read_only=True)
    time_since_posted = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'price',
            'description',
            'image',
            'category_id',
            'category',
            'vendor',
            'time_since_posted',
        ]

    def get_time_since_posted(self, obj):
        return timesince(obj.created_at) + " ago"

    def create(self, validated_data):
        request = self.context.get('request')
        vendor = request.user
        product = Product.objects.create(vendor=vendor, **validated_data)
        return product
