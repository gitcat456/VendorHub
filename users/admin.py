from django.contrib import admin
from .models import User

class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'email', 'phone_number', 'role','location']
    list_filter = ['role']
    search_fields = ['username', 'email']
    list_editable = ['role']  

admin.site.register(User, UserAdmin)