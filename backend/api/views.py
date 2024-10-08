from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User

# Note: views => serializers => models
# serializer checks to make sure all data is correct before being sent to model

# list is is used because there are two functions - either list all notes for a user or create a new one
# class NoteListCreate(generics.ListCreateAPIView):
#     serializer_class = NoteSerializer
#     # IsAuthenticated just means this root cannot be called unless you are authenticated and pass a valid jwt token
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         # self.request.user returns user object
#         user = self.request.user
#         # filters users according to note owner
#         return Note.objects.filter(author=user)

#     # a view will work without overriding but it is needed to get custom functionality
#     # this particular method works by first checking that serializer passes all checks
#     # then saves serializer with a new version of the note 
#     # anything passed in is an additional field
#     # this must be done since author wont be passed in automatically since author is set as read only
#     def perform_create(self, serializer):
#         if serializer.is_valid():
#             serializer.save(author=self.request.user)
#         else:
#             print(serializer.errors)

# class NoteDelete(generics.DestroyAPIView):
#     serializer_class = NoteSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         # filter makes it so that only notes made by you can be deleted
#         return Note.objects.filter(author=user)



class TransactionListCreate(generics.ListCreateAPIView):
    pass

class TransactionDelete(generics.DestroyAPIView):
    pass


# modify?

# TODO add display name
# rather than a custom user model being used the default one is
class CreateUserView(generics.CreateAPIView):
    # specifying list of objects when creating a new one to make sure not to make one which already exists
    queryset = User.objects.all()
    # tells view which data needs to be accepted to make new user (ie username and password)
    serializer_class = UserSerializer
    # specifies who can all this view - in this case anyone
    permission_classes = [AllowAny]