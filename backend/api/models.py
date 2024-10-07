from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from uuid import uuid4

# TODO: switch sequential ID to uuid

# customer UserManager is used since we want to use email in place of username
# This overrides existing actions which will not be needed for other models
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
    
    # password = None does not seem necessary 
    def create_user(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self._create_user(email, password, **extra_fields)

# AbstractUser contains all fields of User but has the ability to be extended off
class User(AbstractUser):
    # Removing the username field from the model
    # Note: could I technically set any default field I dont want to none?
    username = None

    # TODO remove null from display name
    #Additional User fields
    display_name = models.CharField(max_length=100, null=True)
    user_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    email = models.EmailField(('email address'), unique=True)
    user_verified = models.BooleanField(default=False)

    objects = UserManager()

    # changes the default username field from username to email on registration
    # Authentication settings?
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['display_name']
    
# note: serializer needs to be made for this
class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    # auto automatically populates field on creation
    created_at = models.DateTimeField(auto_now_add=True)
    # foreign key here links User to the collection of Notes - each user can have many notes
    # one to many
    # related name is the field name which references all the notes 
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title

class Group(models.Model):
    group_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    group_name = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    group_owner_id = models.ForeignKey(User, on_delete=models.CASCADE)
    

class Transaction(models.Model):
    transaction_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)

    class Meta:
        ordering = ['published_date']  # Orders by `published_date` ascending

    def __str__(self):
        return self.title

class Invite(models.Model):
    invite_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)

# class GroupMembers(models.Model):
#     pass

# class InviteRecipients(models.Model):
#     pass