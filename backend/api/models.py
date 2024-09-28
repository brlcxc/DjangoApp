from django.db import models
from django.contrib.auth.models import User

# note serializer needs to be made for this
class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    # auto autotimatically populates on creation
    created_at = models.DateTimeField(auto_now_add=True)
    # foreign key here links User to the collection of Notes - each user can have many notes
    # one to many
    # related name is the field name which references all the notes 
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title