from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Group, Transaction, Invite
from .forms import CustomUserCreationForm, CustomUserChangeForm

# TODO fix the add user button not working

class UserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    list_display = ('email', 'display_name', 'id', 'user_verified', 'is_staff')
    # Use email for ordering instead of username
    ordering = ['email']

     # Remove the username field from the fieldsets and use email instead
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('display_name',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # This defines the fields that will be shown when adding a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'display_name', 'password1', 'password2'),
        }),
    )

    # Use email for authentication instead of username
    search_fields = ('email',)

class GroupAdmin(admin.ModelAdmin):
    list_display = ('group_name', 'group_owner_id', 'description')

class TransactionAdmin(admin.ModelAdmin):
    pass

class InviteAdmin(admin.ModelAdmin):
    pass

admin.site.register(User, UserAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(Invite, InviteAdmin)