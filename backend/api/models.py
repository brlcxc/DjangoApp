from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from uuid import uuid4

#TODO add password confirmation

# General Notes

# Customer UserManager is used since we want to use email in place of username
# This overrides existing actions which will not be needed for other models
# For Most models the basic "models" functionality is fine

# Instead of having a derived attribute in a model field it might be better to have it in a serializer

# null=True means that field is allowed to be null

# __str__ is used so that a call more readable to a DBA

# an id field is automatically made for each relation and made as the pk but this can be overridden

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_user(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self._create_user(email, password, **extra_fields)

# AbstractUser contains all fields of User but has the ability to be extended off
class User(AbstractUser):
    # Removing the username field from the model
    username = None

    # Adding more security to default ID by using uuid
    # Note: changing the name of id requires a new view to be made for refreshing the token
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)

    # TODO For now unique is set to True however this could allow someone to create an account with an email that isn't their's and prevent the actual owner of the email from using it
    email = models.EmailField(('email address'), unique=True)

    # Additional User fields
    display_name = models.CharField(max_length=100)
    user_verified = models.BooleanField(default=False)

    objects = UserManager()

    # Changes the default username field from username to email on registration - this might be done in serializer 
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['display_name']

    def __str__(self):
        return f"user: {self.display_name}"

class Group(models.Model):
    group_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    group_name = models.CharField(max_length=100)
    description = models.CharField(max_length=100, null=True)
    group_owner_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_groups")
    members = models.ManyToManyField(User, related_name='member_groups')

    def __str__(self):
        return f"group: ${self.group_name}"
    

class Transaction(models.Model):
    transaction_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    category = models.CharField(max_length=100, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)    
    description = models.CharField(max_length=100, null=True)
    start_date = models.DateTimeField(null=False)
    end_date = models.DateTimeField(null=True)
    is_recurrent = models.BooleanField(null=False)
    frequency = models.IntegerField()
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="added_transactions")

    # Orders relation by 'start_date'
    class Meta:
        ordering = ['start_date']

    def __str__(self):
        return f"transaction: ${self.transaction_id}"

# This must be modified to specify which group the invite is for
# for right now the user will be added when an invite is sent
# a user does not have to accept and invite
class Invite(models.Model):
    invite_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    content = models.TextField()
    sender_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="senders")
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="invite_origin")
    recipients = models.ManyToManyField(User, related_name='received_invites')

    def __str__(self):
        return f"transaction: ${self.invite_id}"