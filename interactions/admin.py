from django.contrib import admin
from .models import ContactClick

@admin.register(ContactClick)
class ContactClickAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "contact_type",
        "product",
        "vendor",
        "created_at",
        "ip_address",
        "user_agent",
    )
    list_filter = ("contact_type", "created_at")
    search_fields = ("product__title", "vendor__username")
    ordering = ("-created_at",)
