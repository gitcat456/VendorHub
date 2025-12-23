from django.contrib import admin
from .models import VendorSubscription, SubscriptionPayment

@admin.register(VendorSubscription)
class VendorSubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        "vendor",
        "status",
        "expires_at",
        "is_active_display",
        "created_at",
    )
    list_filter = ("status",)
    search_fields = ("vendor__username", "vendor__email")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("Vendor Info", {
            "fields": ("vendor",)
        }),
        ("Subscription Status", {
            "fields": ("status", "expires_at")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at")
        }),
    )

    def is_active_display(self, obj):
        return obj.is_active()
    is_active_display.boolean = True
    is_active_display.short_description = "Active?"

@admin.register(SubscriptionPayment)
class SubscriptionPaymentAdmin(admin.ModelAdmin):
    list_display = (
        "vendor",
        "amount",
        "phone_number",
        "status",
        "provider_reference",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = (
        "vendor__username",
        "vendor__email",
        "phone_number",
        "provider_reference",
    )
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)

    fieldsets = (
        ("Vendor & Payment", {
            "fields": ("vendor", "amount", "phone_number")
        }),
        ("M-Pesa Info", {
            "fields": ("status", "provider_reference")
        }),
        ("Timestamp", {
            "fields": ("created_at",)
        }),
    )
