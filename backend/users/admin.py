from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Google Auth', {'fields': ('google_id',)}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'google_id')
    search_fields = ('username', 'email', 'google_id')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
