from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from uuid import uuid4

#TODO add password confirmation

# General Notes

# Instead of having a derived attribute in a model field it might be better to have it in a serializer

# null=True means that field is allowed to be null

# __str__ is used so that a call more readable to a DBA

# an id field is automatically made for each relation and made as the pk but this can be overridden

# UserManager overrides BaseUserManager to enable email-based user creation and login, 
# replacing the default username field with email.
class UserManager(BaseUserManager):
    use_in_migrations = True  # Allows using this manager in migrations

    def _create_user(self, email, password, **extra_fields):
        """
        Helper method to create and save a user with the given email and password.
        Ensures an email is provided and normalizes it.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Hashes the password for secure storage
        user.save(using=self._db)  # Saves the user to the default database
        return user
    
    def create_user(self, email, password, **extra_fields):
        """
        Creates a regular user (non-superuser) with the specified email and password.
        """
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)
    
    def create_superuser(self, email, password, **extra_fields):
        """
        Creates a superuser with all permissions enabled.
        Ensures `is_superuser` and `is_staff` are set to True.
        """
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self._create_user(email, password, **extra_fields)


# Custom User model inherits AbstractUser, replacing username with email for authentication.
class User(AbstractUser):
    username = None  # Remove the default username field from AbstractUser

    # Use UUID as the primary key for added security and uniqueness
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)

    # Email is used as the unique identifier for authentication
    email = models.EmailField(('email address'), unique=True)

    # Additional fields to provide user-specific display name and verification status
    display_name = models.CharField(max_length=100)
    user_verified = models.BooleanField(default=False)  # True if the user's email is verified

    # Associate UserManager with User to handle user creation with email
    objects = UserManager()

    # Define email as the unique identifier for authentication instead of username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['display_name']  # Additional fields required when creating a user

    def __str__(self):
        # Custom string representation for debugging and admin display
        return f"user_email: {self.email}"


# Group model represents a collection of users with a designated owner.
class Group(models.Model):
    group_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)  # Unique ID for each group
    group_name = models.CharField(max_length=100)  # Name of the group
    description = models.CharField(max_length=100, null=True)  # Optional description of the group
    group_owner_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_groups")  # Owner of the group
    members = models.ManyToManyField(User, related_name='member_groups')  # Users who are members of the group

    def __str__(self):
        # Custom string representation for debugging and admin display
        return f"group_name: {self.group_name} group_id: {self.group_id}"


# Transaction model records individual financial transactions associated with a Group.
class Transaction(models.Model):
    transaction_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)  # Unique ID for each transaction
    category = models.CharField(max_length=100, null=True)  # Category of the transaction (e.g., "groceries")
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # Transaction amount with two decimal precision
    description = models.CharField(max_length=100, null=True)  # Optional description of the transaction
    start_date = models.DateTimeField(null=False)  # Start date/time of the transaction
    end_date = models.DateTimeField(null=True)  # Optional end date/time, used for recurrent transactions
    is_recurrent = models.BooleanField(null=False)  # True if the transaction repeats (e.g., monthly bills)
    frequency = models.IntegerField()  # Frequency in days (e.g., 30 for monthly, 7 for weekly)
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="added_transactions")  # Associated group

    class Meta:
        ordering = ['start_date']  # Orders transactions by start date by default

    def __str__(self):
        # Custom string representation for debugging and admin display
        return f"transaction_id: {self.transaction_id}"


# Invite model manages invitations for users to join specific groups.
class Invite(models.Model):
    invite_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)  # Unique ID for each invite
    content = models.TextField()  # Content or message of the invitation
    sender_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="senders")  # User who sent the invite
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="invite_origin")  # Target group
    recipients = models.ManyToManyField(User, related_name='received_invites')  # Users receiving the invitation

    def __str__(self):
        # Custom string representation for debugging and admin display
        return f"invite_id: {self.invite_id}"