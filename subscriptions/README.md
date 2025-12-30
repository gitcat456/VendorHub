# M-Pesa Daraja Integration

This directory contains the logic for integrating M-Pesa STK Push (Lipa Na M-Pesa Online) into the VendorHub application.

## Overview

We utilize the `mpesa-daraja` Python package, but with a **custom wrapper** (`CustomMpesaExpress`) to robustly handle the API interaction, credentials, and environment-specific URLs.

## Workflow

1.  **Frontend**: Vendor clicks "Pay with M-Pesa" on the dashboard.
2.  **API Request**: Frontend sends `POST` to `/subscriptions/initiate/` with `amount` and `phone_number`.
3.  **Backend (Initiation)**:
    *   Validates the phone number (Must start with `254` and be 12 digits).
    *   Creates a `SubscriptionPayment` record with status `pending`.
    *   Calls `get_mpesa_client()` to initialize the M-Pesa client.
    *   Calls `client.stk_push()` to trigger the Prompt on the user's phone.
    *   Updates the payment record with the `CheckoutRequestID` from M-Pesa.
4.  **User Action**: User enters their M-Pesa PIN on their phone.
5.  **M-Pesa Callback (Webhook)**:
    *   M-Pesa sends a `POST` request to our `MPESA_CALLBACK_URL` (`/subscriptions/webhook/`).
    *   View `MpesaWebhook` processes this request.
    *   If `ResultCode == 0` (Success):
        *   Updates `SubscriptionPayment` status to `success`.
        *   Updates/Creates the `VendorSubscription` record to `active`.
    *   If `ResultCode != 0` (Failed/Cancelled):
        *   Updates `SubscriptionPayment` status to `failed`.

## Key Files

*   **`mpesa_utils.py`**: Contains the core integration logic.
    *   `CustomMpesaExpress`: A subclass of `MpesaExpress` that:
        *   Manually handles Authentication (generating the Bearer token).
        *   Manually constructs the STK Push payload (generating the Password from Shortcode + Passkey + Timestamp).
        *   Aggressively strips whitespace from credentials to prevent errors.
        *   Enforces correct Sandbox/Live URLs.
*   **`views.py`**:
    *   `InitiateSubscriptionPayment`: API Endpoint to start the payment.
    *   `MpesaWebhook`: API Endpoint to receive the final status from Safaricom.
*   **`models.py`**:
    *   `SubscriptionPayment`: Tracks individual transaction attempts.
    *   `VendorSubscription`: Tracks the vendor's active subscription status.

## Dependencies

*   `django`
*   `djangorestframework`
*   `requests` (for HTTP calls to M-Pesa)
*   `python-decouple` (for `.env` management)
*   `mpesa-daraja` (Base library, though correctly patched by `mpesa_utils.py`)
*   `Pillow` (Dependencies for ImageFields in models)

## Configuration (.env)

Ensure these variables are set in your root `.env` file (without trailing spaces!):

```ini
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_SHORTCODE=174379  # Default for Sandbox
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919 # Default for Sandbox
MPESA_CALLBACK_URL=https://your-domain.com/subscriptions/webhook/
```

## Common Errors & Fixes

*   **Invalid Access Token**: Usually due to whitespace in `.env` keys or using a Sandbox key on a Live URL. Resolved by `CustomMpesaExpress` logic.
*   **Wrong Credentials**: Usually due to `MPESA_PASSKEY` length (Sandbox is 64 chars) or mismatch between Shortcode and Passkey. Use standard Sandbox values.
*   **Invalid Remarks (400.002.02)**: Request Descriptions too long. `CustomMpesaExpress` defaults to safe short strings "Pay" and "PayID".
