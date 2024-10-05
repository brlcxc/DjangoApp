from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager

# TODO: switch sequential ID to uuid

# customer UserManager is used since we want to use email in place of username
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
    
    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

# AbstractUser contains all fields of User but has the ability to be extended off
class User(AbstractUser):
    # Removing the username field from the model
    username = None

    # TODO remove null from display name
    display_name = models.CharField(max_length=100, null=True)

    USERNAME_FIELD = 'email'
    email = models.EmailField(('email address'), unique=True)
    objects = UserManager()

    # changes the default username field from username to email on registration
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
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