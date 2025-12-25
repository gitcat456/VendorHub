from mpesa.api.mpesa_express import MpesaExpress
from django.conf import settings

class CustomMpesaExpress(MpesaExpress):
    def __init__(self, env="sandbox", app_key=None, app_secret=None, **kwargs):
        self.env = env
        self.app_key = str(app_key).strip() if app_key else None
        self.app_secret = str(app_secret).strip() if app_secret else None
        
        if env == "sandbox":
            self.api_base_url = "https://sandbox.safaricom.co.ke"
        else:
            self.api_base_url = "https://api.safaricom.co.ke"

        self.sandbox_url = "https://sandbox.safaricom.co.ke"
        self.live_url = "https://api.safaricom.co.ke"
            
        self.headers = {"Content-Type": "application/json"}
        self.authentication_token = self.authenticate()

    def authenticate(self):
        import requests
        from requests.auth import HTTPBasicAuth
        
        url = f"{self.api_base_url}/oauth/v1/generate?grant_type=client_credentials"
        try:
            r = requests.get(url, auth=HTTPBasicAuth(self.app_key, self.app_secret))
            print(f"Auth Status: {r.status_code}") # Debug print
            print(f"Auth Response: {r.text}")      # Debug print
            
            if r.status_code == 200:
                token = r.json().get("access_token")
                self.headers["Authorization"] = f"Bearer {token}"
                return token
            else:
                return None
        except Exception as e:
            print(f"Auth Error: {e}")
            return None

    def stk_push(self, amount, phone_number, callback_url, account_reference="PayID", transaction_desc="Pay", business_shortcode=None, passkey=None):
        import requests
        import base64
        from datetime import datetime
        
        shortcode = business_shortcode or str(settings.MPESA_SHORTCODE).strip()
        passkey = passkey or str(settings.MPESA_PASSKEY).strip()
        
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_str = f"{shortcode}{passkey}{timestamp}"
        password = base64.b64encode(password_str.encode()).decode('utf-8')
        
        url = f"{self.api_base_url}/mpesa/stkpush/v1/processrequest"
        
        payload = {
            "BusinessShortCode": shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone_number,
            "PartyB": shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": callback_url,
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc
        }
        
        # Refresh token to be safe
        token = self.authenticate()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        print(f"STK Push URL: {url}")
        print(f"STK Push Token (First 10 chars): {token[:10] if token else 'None'}")
        
        try:
            r = requests.post(url, json=payload, headers=headers)
            print(f"STK Push Response: {r.text}")
            return r.json()
        except Exception as e:
            print(f"STK Push Error: {e}")
            return {"errorCode": "500", "errorMessage": str(e)}

def get_mpesa_client():
    return CustomMpesaExpress(
        env=settings.MPESA_ENVIRONMENT,
        app_key=settings.MPESA_CONSUMER_KEY,
        app_secret=settings.MPESA_CONSUMER_SECRET
    )