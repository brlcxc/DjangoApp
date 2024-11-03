import os
import re
from decimal import Decimal
import datetime
from rest_framework import generics
from .serializers import UserSerializer, GroupSerializer, TransactionSerializer, InviteSerializer, LLMRequestSerializer, LLMResponseSerializer
from django.utils.http import urlsafe_base64_decode
from rest_framework.views import APIView
from .tokens import email_verification_token
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import User, Group, Transaction
from .utils import send_verification_email, get_user_transactions_for_groups, process_llm_prompt
from datetime import date
from rest_framework.response import Response
from rest_framework import status

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

        return get_user_transactions_for_groups(user, group_uuid_list)

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

# Note: maybe split the first step into a separate view to give users the ability to manually add and remove situations
# I am unsure how to best transfer info in that situation though 
# I am now thinking that I will need to because how else can I display the categories output
# I will also need a separate view to give the evaluation and suggestion on the new data compared to the old

# I might need to pass a topic as well
# the new transactions need the context of what the categories are for - not sure where to store this though
# import in todays date rather than using last date
# new expenses need to be based off current expenses as well as new which either modify current or are entirely new
# I might need to have some sort of generate button between the first and second step
# I also do need that date passed
# I might want to hard code it in for now

# maybe I should even just have one prompt for similar and one for brand new?
# make a statement to ensure they are date relevant 

# one issue with the three step is that it would be hard to send the data all the way back again to be evaluated
# maybe I can just append the two responses to each other - add the strings together
# in that case I could just do one view but then I wouldnt get feedback
class LLMCategoryResponseView(generics.GenericAPIView):
    serializer_class = LLMRequestSerializer  # Serializer for input data
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Deserialize and validate the user input
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get the user question and group UUIDs from the validated data
        user_question = serializer.validated_data['question']

        category_question = f"{user_question}\n\nFrom this user question derive 1 to 5 categories that represent financial situations which could cause a change in costs or spending. Form them into a list of short 1 to 4 word situations in the format situations = [] Also provide 2 or 3 words for the subject of the message in the form subject = subject"

        category_answer =  process_llm_prompt(category_question)
        # Serialize and return the LLM response
        response_serializer = LLMResponseSerializer(data={"answer": category_answer})
        response_serializer.is_valid(raise_exception=True)
        return Response(response_serializer.data, status=status.HTTP_200_OK)

# it might be unwise to send the transactions back after the second response because it isn't efficient to send
# it would be better to call the third within the second and merge the lists there
class LLMTransactionResponseView(generics.GenericAPIView):
    serializer_class = LLMRequestSerializer  # Serializer for input data
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Deserialize and validate the user input
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Get the user question and group UUIDs from the validated data
        category_input = serializer.validated_data['question']

        group_uuid_list = self.kwargs.get('group_uuid_list', '')
        transactions_data = get_user_transactions_for_groups(request.user, group_uuid_list).values('category', 'amount', 'description', 'start_date')
        new_transaction_question = f"From this data {transactions_data}\n\n and this subject and situations {category_input}\n\n Can you provide 20 new transactions after {date}? Some should follow the trends of the existing transactions as well as account for the subject and situations. If a situation relates to an existing category then a new transaction in that category should be given a cost accordingly. Please provide them as list of lists in the form new_transactions=[[]] with no additional information"
        
        transaction_answer =  process_llm_prompt(new_transaction_question)

        print(transaction_answer)
        test = re.sub(r'```python|```|from decimal import Decimal|import datetime|new_transactions\s*=\s*', '', transaction_answer)

        parsed_transactions = eval(
            test,
            {"Decimal": Decimal, "datetime": datetime}
        )

        cleaned_transactions = [
            {
                'category': transaction[0],
                'amount': float(transaction[1]),
                'description': transaction[2],
                'date': transaction[3].strftime('%Y-%m-%d')
            }
            for transaction in parsed_transactions
        ]

        print(cleaned_transactions)

        # Serialize and return the LLM response
        response_serializer = LLMResponseSerializer(data={"answer": str(cleaned_transactions)})
        response_serializer.is_valid(raise_exception=True)
        return Response(response_serializer.data, status=status.HTTP_200_OK)