from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

# Note: I need to figure out wht the ordering is just changed for UserAdmin and not User

# the default UserAdmin needs to be overridden since username is no longer needed
class UserAdmin(BaseUserAdmin):
    # Use email for ordering instead of username
    ordering = ['email']

admin.site.register(User, UserAdmin)

# Register your models here.
