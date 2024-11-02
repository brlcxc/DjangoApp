import os
import vertexai
import json
from rest_framework import generics
from .serializers import UserSerializer, GroupSerializer, TransactionSerializer, InviteSerializer, LLMRequestSerializer, LLMResponseSerializer
from django.utils.http import urlsafe_base64_decode
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .tokens import email_verification_token
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import User, Group, Transaction
from .utils import send_verification_email
from google.oauth2 import service_account  # Importing service_account
from vertexai.generative_models import GenerativeModel

# Note: views => serializers => models
# TODO check if Update and Destroy for Transaction need their methods overwritten
# TODO check if Update for Group needs their method overwritten
# TODO ensure logic for grabbing uuid is consistent with all instances
# TODO pass multiple recipient uuid to the invite

class UserCreateView(generics.CreateAPIView):
    # specifying list of objects when creating a new one to make sure not to make one which already exists
    queryset = User.objects.all()
    # tells view which data needs to be accepted to make new user (ie username and password)
    serializer_class = UserSerializer
    # specifies who can all this view - in this case anyone
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        # why must user_verified be set to false when it is already by default false
        user = serializer.save(user_verified=False)  # save the user and set user_verified to False
        send_verification_email(user, self.request)  # email sent upon user creation

        # Create a default group for the new user
        Group.objects.create(
            group_name=f"{user.display_name}'s Group",  # Optional: customize name
            group_owner_id=user,
            description="This is the default group for new user."
        )

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    # normally you would need a pk for get_object but in this case it is just done with the token
    def get_object(self):
        return self.request.user

class GroupListCreate(generics.ListCreateAPIView):
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # self.request.user returns user object
        user = self.request.user

        # Query for groups where the user is either the owner or a member
        # An owner is not listed as a member which is why this needs to be done
        return Group.objects.filter(
            Q(members=user) | Q(group_owner_id=user)
        )
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(group_owner_id=self.request.user)
        else:
            print(serializer.errors)

class GroupRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # self.request.user returns user object
        user = self.request.user

        # Query for groups where the user is either the owner or a member
        return Group.objects.filter(
            Q(members=user) | Q(group_owner_id=user)
        )
        
    def get_object(self):
        # Override to ensure object-level permission checks if necessary
        queryset = self.get_queryset()
        
        # The UUID for the transaction is passed via the URL kwargs as 'pk'
        obj = get_object_or_404(queryset, group_id=self.kwargs["pk"])
        
        # Check object-level permissions if needed
        self.check_object_permissions(self.request, obj)
        
        return obj
    
    # Only an owner is allowed to delete a group but a member will still be able to leave the group
    def perform_destroy(self, instance):
        user = self.request.user
        # Check if the user is the owner of the group
        if instance.group_owner_id == user:
            # If the user is the owner, delete the entire group
            instance.delete()
        else:
            # If the user is just a member, remove them from the group
            instance.members.remove(user)

# create and List are not combined because List takes in multiple uuid while create needs one
class TransactionCreate(generics.CreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Get the single group UUID from the URL
        group_uuid = self.kwargs.get('group_uuid')

        # Find the group instance based on the UUID
        group = Group.objects.get(group_id=group_uuid)
        
        if serializer.is_valid():
            serializer.save(group_id=group)
        else:
            print(serializer.errors)

# multiple uuid are input allowing transactions from multiple groups to show at once
class TransactionList(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the currently authenticated user
        user = self.request.user

        # Extract group UUIDs from the URL route
        group_uuid_list = self.kwargs.get('group_uuid_list', '')

        # Convert the group_uuid_list string into a list of UUIDs
        group_uuids = group_uuid_list.split(',')

        # Query for groups where the user is either the owner or a member
        # when __in is used with group_id in this case it checks if each transaction's group_id is part of the incoming list group_uuids
        user_groups = Group.objects.filter(
            (Q(members=user) | Q(group_owner_id=user)) & Q(group_id__in=group_uuids)
        )

        # Return transactions that belong to the filtered groups by extracting IDs
        # when __in is used with group_id in this case it checks if each transaction's group_id is part of the user_groups filter
        # flat=true flattens the result so that instead of getting a list of tuples, you get a simple list of values when requesting a single field
        return Transaction.objects.filter(group_id__in=user_groups.values_list('group_id', flat=True)).select_related('group_id')

class TransactionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the currently authenticated user
        user = self.request.user

        # Query for groups where the user is either the owner or a member
        user_groups = Group.objects.filter(
            Q(members=user) | Q(group_owner_id=user)
        )

        # Return transactions that belong to the user's groups (either owned or member)
        return Transaction.objects.filter(group_id__in=user_groups)
    
    def get_object(self):
        # Override to ensure object-level permission checks if necessary
        queryset = self.get_queryset()
        
        # The UUID for the transaction is passed via the URL kwargs as 'pk'
        obj = get_object_or_404(queryset, transaction_id=self.kwargs["pk"])
        
        # Check object-level permissions if needed
        self.check_object_permissions(self.request, obj)
        
        return obj

# even though invites will be done in the service layer they will still be stored here
class InviteCreateView(generics.CreateAPIView):
    serializer_class = InviteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Get the recipient and group UUIDs from the URL parameters
        recipient = self.kwargs.get('recipient_uuid')
        group = self.kwargs.get('group_uuid')

        if serializer.is_valid():
            serializer.save(sender_id=self.request.user, received_invites=recipient, group_id=group)
        else:
            print(serializer.errors)

# TODO verify this
# when is this even called?
# what is request doing here?

# this view is put in use when a user clicks the verification link
# send_verification_email in UserCreateView is what starts this process
class VerifyEmail(APIView):
    # when receiving the id it is still encoded as uuidb64
    # request is the http request data
    # token is the token generated by the send_verification_email function
    def get(self, request, uuidb64, token):
        try:
            uuid = urlsafe_base64_decode(uuidb64).decode()  # Decoding uui
            user = User.objects.get(pk=uuid)  # Using uuid as the primary key
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        # checks token validity and updates user verified if successful
        if user is not None and email_verification_token.check_token(user, token):
            user.user_verified = True
            user.save()
            return Response({'status': 'Email verified successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'Invalid verification link'}, status=status.HTTP_400_BAD_REQUEST)

class LLMResponseView(generics.GenericAPIView):
    serializer_class = LLMRequestSerializer  # Serializer for input data
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # Deserialize and validate the user input
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get the user question and group UUIDs from the validated data
        user_question = serializer.validated_data['question']
        # group_uuid_list = serializer.validated_data.get('group_uuid_list', '')

        # # Retrieve transaction data using the TransactionList view
        # transaction_list_view = TransactionList()
        # transaction_list_view.request = request
        # transaction_list_view.kwargs = {'group_uuid_list': group_uuid_list}
        
        # transactions_queryset = transaction_list_view.get_queryset()
        # transactions_data = TransactionSerializer(transactions_queryset, many=True).data

        # Load credentials from the environment variable
        credentials_json = os.getenv('GOOGLE_CREDENTIALS')
        if credentials_json is None:
            return Response({"error": "GOOGLE_CREDENTIALS environment variable is not set."}, status=status.HTTP_400_BAD_REQUEST)

        # Convert the JSON string to a dictionary
        try:
            credentials_dict = json.loads(credentials_json)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format for GOOGLE_CREDENTIALS."}, status=status.HTTP_400_BAD_REQUEST)

        # Initialize Vertex AI with credentials and project ID
        try:
            credentials = service_account.Credentials.from_service_account_info(credentials_dict)
            PROJECT_ID = credentials.project_id
            vertexai.init(project=PROJECT_ID, location="us-central1", credentials=credentials)
        except Exception as e:
            return Response({"error": f"Failed to initialize Vertex AI: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Generate response using the generative model
        try:
            # Include transaction data in the question for context
            # question_with_data = f"{user_question}\n\nUser transaction data: {transactions_data}"
            # question_with_data = f"{user_question}\n\nFrom this user question derive 1 to 5 categories that represent financial situations which could cause a change in costs or spending. Form them into categories = []"
            # question_with_data = f"{user_question}\n\nFrom this user question derive 1 to 5 categories that represent financial situations which could cause a change in costs or spending. Form them into a list of situations in the format situations = []"
            question_with_data = f"{user_question}\n\nFrom this user question derive 1 to 5 categories that represent financial situations which could cause a change in costs or spending. Form them into a list of short 1 to 4 word situations in the format situations = []"
         
            model = GenerativeModel("gemini-1.5-flash-002")
            # I will call mutiple prompts in this to feed back into itself

            # new transactions follow old, increase old ccordingly, and add new 
            response = model.generate_content([question_with_data])
            answer = response.text.strip()
        except Exception as e:
            return Response({"error": f"Failed to generate response: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Serialize and return the LLM response
        response_serializer = LLMResponseSerializer(data={"answer": answer})
        response_serializer.is_valid(raise_exception=True)
        return Response(response_serializer.data, status=status.HTTP_200_OK)