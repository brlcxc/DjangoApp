from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

# serializer checks to make sure all data is correct

# list is is used because there are two functions - either list all notes for a user or create a new one
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    # IsAuthenticated just means this root can not be called unless you are authenticated and pass a valid jwt token
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # self.request.user returns user object
        user = self.request.user
        # filters users according to note owner
        return Note.objects.filter(author=user)

    # a view will work with just the seroalizer class, permission class, and quesry set
    # to get custom functionailtiy we need to override specific methods such as this
    # this method works by first checking that srrializer passes all checks - then saves serialzier with a new versoon of the note - anythign passed in is an additional feild
    # this must be done since author wont be passed in automaticalyy since author is set as read only
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # makes it so that only notes made by you can be deleted
        return Note.objects.filter(author=user)

class CreateUserView(generics.CreateAPIView):
    # specifying list of objects when creating a new one to make sure not to make one which already exists
    queryset = User.objects.all()
    # tells view which data needs to be accpeted to make new user (ie username and password)
    serializer_class = UserSerializer
    # specifies who can all this view - in this case anyone
    permission_classes = [AllowAny]