from mpesa.api.mpesa_express import MpesaExpress
from django.conf import settings

def get_mpesa_client():
    return MpesaExpress(
        env=settings.MPESA_ENVIRONMENT,
        app_key=settings.MPESA_CONSUMER_KEY,
        app_secret=settings.MPESA_CONSUMER_SECRET
    )
