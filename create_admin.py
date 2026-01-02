import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vendorHub.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username="denzel").exists():
    User.objects.create_superuser(
        username="denzel",
        email="okothdenzel65@gmail.com",
        password="Bx@45116"
    )
    print("Superuser created!")
else:
    print("Superuser already exists.")
