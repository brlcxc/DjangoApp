from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer, GroupSerializer, TransactionSerializer, InviteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Group, Transaction, Invite

# Note: views => serializers => models

class UserCreateView(generics.CreateAPIView):
    # specifying list of objects when creating a new one to make sure not to make one which already exists
    queryset = User.objects.all()
    # tells view which data needs to be accepted to make new user (ie username and password)
    serializer_class = UserSerializer
    # specifies who can all this view - in this case anyone
    permission_classes = [AllowAny]

# Note: issue of using pk or not has conflicting info
class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    # normally you would need a pk for get_object but we want to do it just with the token
    def get_object(self):
        return self.request.user

# I also need to list all groups where the user is a member
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

# might need to divide this down further because the members should still be able to update and retrieve but only the owner should delete
# the user still needs a way to remove themselves from the group though
# maybe an if else on if group member or not?
class GroupRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Group.objects.filter(group_owner_id=self.request.user)

# any member of a group should have this right
class TransactionListCreate(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # self.request.user returns user object
        user = self.request.user
        # filters users according to note owner

        #must have ID of member in connected group
        return Group.objects.filter(group_owner_id=user)

# restricted to members of a group
class TransactionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # self.request.user returns user object
        user = self.request.user
        # filters users according to note owner
        return Group.objects.filter(group_owner_id=user)

# does it even make sense to store this since an invite will be in the service layer    
class InviteCreateView(generics.CreateAPIView):
    serializer_class = InviteSerializer
    permission_classes = [IsAuthenticated]