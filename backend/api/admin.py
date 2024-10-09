from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Group, Transaction, Invite

# TODO fix the add user button not working

class UserAdmin(BaseUserAdmin):
    # Use email for ordering instead of username
    list_display = ('email', 'display_name', 'id', 'user_verified', 'is_staff')
    ordering = ['email']

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