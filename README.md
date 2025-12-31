VendorHub Backend

Django + Django REST Framework

VendorHub is an API-first backend for a classifieds/marketplace platform , built with scalability and clean architecture in mind. The frontend is fully decoupled and consumes this API independently.

What it Does

Vendors create accounts and manage profiles

Vendors publish products or services

Public users browse listings without authentication

Visitors contact vendors via Call or WhatsApp

All contact interactions are logged for analytics

No in-app messaging. No payments. Fast, simple, and realistic.

Tech Stack

Python

Django

Django REST Framework

SQLite

Architecture Highlights

Single User Model – vendors are users with role flags

Public Browsing – listings are accessible without login

JWT Authentication – required only for vendor actions

External Communication – calls and WhatsApp handled outside the app

App Structure
backend/
├── users/         # Auth, roles, vendor profiles
├── products/      # Listings, categories
├── interactions/  # Call / WhatsApp click logging
├── config/        # Project settings

Contact Interaction Logging

Each Call or WhatsApp click records:

Product

Vendor

Contact type

Timestamp (+ optional metadata)

This enables engagement analytics without interrupting user flow.

Admin Panel

The Django admin is used to:

Manage users and vendors

Review products

Inspect interaction logs

Getting Started
git clone <repo>
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
