VendorHub Backend (Django + DRF)
Overview

This project is a Django REST API backend for a classifieds / marketplace platform (similar to Jiji).

The system allows:

Vendors to create accounts and manage their profiles

Vendors to post products/services for advertisement

Public users to browse listings without authentication

Visitors to contact vendors directly via Call or WhatsApp

Logging of contact interactions for analytics

The backend is designed to be API-first, with frontend handled separately.

Tech Stack

Python

Django

Django REST Framework (DRF)

SQLite 

Core Concepts

Single User model
Vendors are users differentiated by roles/flags (no separate Vendor model).

Public browsing
Product listings are accessible without authentication.

No in-app messaging or payments
Communication happens externally via phone or WhatsApp.

Apps Structure
backend/
├── users/          # Authentication, roles, vendor profiles
├── products/       # Product CRUD and categories
├── interactions/   # Contact click logging (Call / WhatsApp)
├── config/         # Project settings

App Responsibilities
Users App

User registration and authentication

Vendor role management

Vendor profile data

Products App

Product creation, update, and deletion (vendors only)

Product categories (e.g. Houses, Food, Electronics)

Public product listing and detail endpoints

Interactions App

Logs contact actions when a user:

Clicks Call

Clicks WhatsApp

Used for analytics (e.g. most contacted products)

Authentication

Vendors authenticate using JWT

Public users do not require authentication to browse products

Only authenticated vendors can create or manage products

Contact Interaction Logging

When a visitor clicks a contact button:

The frontend sends a request to the backend

The backend logs:

Product

Vendor

Contact type (call / whatsapp)

Timestamp

Optional metadata (IP, user agent)

This helps track listing engagement without blocking user flow.

Admin Panel

The Django admin panel is used for:

Managing users and vendors

Reviewing products

Viewing contact interaction logs

Setup Instructions

Clone the repository

Create and activate a virtual environment

Install dependencies

Run migrations

Create a superuser

Start the development server

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

Future Improvements

Advanced vendor analytics dashboard

Product moderation workflow

Search and filtering optimizations

API versioning

Rate limiting on interaction logging

Purpose

This backend is built as a capstone project, focusing on:

Clean architecture

Realistic system design

Scalability and separation of concerns