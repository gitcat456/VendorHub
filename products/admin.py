from django.contrib import admin
from .models import VendorProfile, Product, ProductImage, Category
from django.utils.html import format_html

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']
  
class VendorProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'bss_name', 'vendor', 'bss_location']
    
    def profile_pic_preview(self, obj):
        if obj.profile_pic:
            return format_html(f'<img src="{obj.profile_pic.url}" width="50" height="50" />')
        return "No Image"
    profile_pic_preview.short_description = 'Profile Pic'
    
    search_fields = ['bss_name', 'vendor__username']


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1 

class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'category', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'bss__name']
    inlines = [ProductImageInline]  


class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'image']
    list_filter = ['product__category']


admin.site.register(Category, CategoryAdmin)
admin.site.register(VendorProfile, VendorProfileAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage, ProductImageAdmin)