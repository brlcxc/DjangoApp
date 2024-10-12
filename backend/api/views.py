from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer, GroupSerializer, TransactionSerializer, InviteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Group, Transaction, Invite

# Note: views => serializers => models
# serializer checks to make sure all data is correct before being sent to model

class TransactionListCreate(generics.ListCreateAPIView):
    pass

class TransactionDelete(generics.DestroyAPIView):
    pass

# list is is used because there are two functions - either list all notes for a user or create a new one
class GroupListCreate(generics.ListCreateAPIView):
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # self.request.user returns user object
        user = self.request.user
        # filters users according to note owner
        return Group.objects.filter(group_owner_id=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(group_owner_id=self.request.user)
        else:
            print(serializer.errors)

class GroupDelete(generics.DestroyAPIView):
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # filter makes it so that only notes made by you can be deleted
        return Group.objects.filter(group_owner_id=self.request.user)

class CreateUserView(generics.CreateAPIView):
    # specifying list of objects when creating a new one to make sure not to make one which already exists
    queryset = User.objects.all()
    # tells view which data needs to be accepted to make new user (ie username and password)
    serializer_class = UserSerializer
    # specifies who can all this view - in this case anyone
    permission_classes = [AllowAny]

class RetrieveUserView(generics.RetrieveAPIView):
    # queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  # Customize permissions as needed

    # normally you would need a pk for get_object but we want to do it just with the token
    def get_object(self):
        return self.request.user