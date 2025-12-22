from django.contrib import admin
from .models import Product, Category
from django.utils.html import format_html

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']
  

class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'category', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'bss__name']

admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
