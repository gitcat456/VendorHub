from django.urls import path
from .views import InitiateSubscriptionPayment, MpesaWebhook


urlpatterns = [
    path("initiate/", InitiateSubscriptionPayment.as_view(), name="initiate"),
    path("webhook/", MpesaWebhook.as_view(), name="webhook"),
]
