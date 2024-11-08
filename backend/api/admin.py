from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Group, Transaction, Invite
from .forms import CustomUserCreationForm, CustomUserChangeForm

# Custom admin for the User model
class UserAdmin(BaseUserAdmin):
    # Specify forms for creating and updating users in the admin
    add_form = CustomUserCreationForm  # Form for adding new users
    form = CustomUserChangeForm  # Form for updating existing users

    # Fields to display in the User list view in the admin interface
    list_display = ('email', 'display_name', 'id', 'user_verified', 'is_staff')
    
    # Order user list by email in the admin
    ordering = ['email']

    # Fieldsets control how fields are organized in the user edit page
    # Remove username field as we're using email for authentication
    fieldsets = (
        (None, {'fields': ('email', 'password')}),  # Basic user credentials
        ('Personal info', {'fields': ('display_name',)}),  # Personal information
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),  # Admin permissions
        ('Important dates', {'fields': ('last_login', 'date_joined')}),  # Metadata dates
    )

    # Fieldsets for the add user page, showing email, display_name, and password fields
    add_fieldsets = (
        (None, {
            'classes': ('wide',),  # CSS class for wide layout
            'fields': ('email', 'display_name', 'password1', 'password2'),  # Fields needed to create a user
        }),
    )

    # Specify the search fields in the user admin list view
    search_fields = ('email',)  # Enables searching users by email

# Custom admin for the Group model
class GroupAdmin(admin.ModelAdmin):
    # Fields to display in the Group list view in the admin interface
    list_display = ('group_name', 'group_owner_id', 'description')

    # Optional: You could add search_fields or ordering here if you want to make the Group admin view more interactive

# Basic admin configuration for Transaction model
# Currently does not customize the Transaction admin interface but can be expanded
class TransactionAdmin(admin.ModelAdmin):
    pass  # Placeholder for any Transaction customizations

# Basic admin configuration for Invite model
# Currently does not customize the Invite admin interface but can be expanded
class InviteAdmin(admin.ModelAdmin):
    pass  # Placeholder for any Invite customizations

# Register models and their custom admin configurations to the Django admin site
admin.site.register(User, UserAdmin)  # Registers User model with custom UserAdmin
admin.site.register(Group, GroupAdmin)  # Registers Group model with custom GroupAdmin
admin.site.register(Transaction, TransactionAdmin)  # Registers Transaction model with default admin
admin.site.register(Invite, InviteAdmin)  # Registers Invite model with default admin