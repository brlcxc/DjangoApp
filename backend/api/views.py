import re
import datetime
from rest_framework import generics
from .serializers import UserSerializer, GroupSerializer, TransactionSerializer, InviteSerializer, LLMRequestSerializer, LLMTransactionResponseSerializer, LLMCategoryResponseSerializer, LLMCharResponseSerializer
from django.utils.http import urlsafe_base64_decode
from rest_framework.views import APIView
from .tokens import email_verification_token
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import User, Group, Transaction
from .utils import send_verification_email, get_user_transactions_for_groups, process_llm_prompt, process_GPT_llm_prompt
from datetime import date
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal

# Note: views => serializers => models
# TODO check if Update and Destroy for Transaction need their methods overwritten
# TODO check if Update for Group needs their method overwritten
# TODO ensure logic for grabbing uuid is consistent with all instances
# TODO pass multiple recipient uuid to the invite

class UserCreateView(generics.CreateAPIView):
    # Specifying list of objects when creating a new one to make sure not to make one which already exists
    queryset = User.objects.all()
    # Tells view which data needs to be accepted to make new user (ie username and password)
    serializer_class = UserSerializer
    # Specifies who can all this view - in this case anyone
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

    # Normally you would need a pk for get_object but in this case it is just done with the token
    def get_object(self):
        return self.request.user
    
class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    # Normally you would need a pk for get_object but in this case it is just done with the token
    def get_queryset(self):
        return User.objects

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

# Create and List are not combined because List takes in multiple uuid while create needs one
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

# Multiple uuid are input allowing transactions from multiple groups to show at once
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

# Even though invites will be done in the service layer they will still be stored here
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
# When is this even called?
# What is request doing here?

# This view is put in use when a user clicks the verification link
# send_verification_email in UserCreateView is what starts this process
class VerifyEmail(APIView):
    # When receiving the id it is still encoded as uuidb64
    # Request is the http request data
    # Token is the token generated by the send_verification_email function
    def get(self, request, uuidb64, token):
        try:
            uuid = urlsafe_base64_decode(uuidb64).decode()  # Decoding uui
            user = User.objects.get(pk=uuid)  # Using uuid as the primary key
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        # Checks token validity and updates user verified if successful
        if user is not None and email_verification_token.check_token(user, token):
            user.user_verified = True
            user.save()
            return Response({'status': 'Email verified successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'Invalid verification link'}, status=status.HTTP_400_BAD_REQUEST)

# right now I just have a separate subject but maybe it would be better to append it to each category
# maybe I have the subject as an unchanging block and then only the categories can be modified further
# I need a way to send the data properly - maybe split it into two like with the other view - not sure how to serialize that though
class LLMCategoryResponseView(generics.GenericAPIView):
    serializer_class = LLMRequestSerializer  # Serializer for input data
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Deserialize and validate the user input
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get the user question and group UUIDs from the validated data
        user_question = serializer.validated_data['question']

        category_question = f"The user financial question/situation is as follows: {user_question}\n\nFrom this user question derive 1 to 5 categories that represent financial situations which could cause a change in costs or spending. Form them into a list of short 1 to 4 word situations in the format situations = [] Also provide 2 or 3 words for the subject of the message in the form subject = subject"

        category_answer =  process_llm_prompt(category_question)
        print("test7")
        print(category_answer)

        # Parse the string response to structured data
        situations = re.findall(r'situations = \[(.*?)\]', category_answer)
        subject = re.search(r'subject = "(.*?)"', category_answer)

        # Convert parsed strings to proper data types
        situations_list = situations[0].split(", ") if situations else []
        subject_str = subject.group(1) if subject else ""

        # print(situations_list)
        # print(subject_str)

        # Return the structured data
        response_data = {
            "situations": [s.strip('"') for s in situations_list],
            "subject": subject_str
        }

        response_serializer = LLMCategoryResponseSerializer(data=response_data)
        response_serializer.is_valid(raise_exception=True)
        return Response(response_serializer.data, status=status.HTTP_200_OK)

class LLMTransactionResponseView(generics.GenericAPIView):
    # Define the serializer to handle incoming data validation
    serializer_class = LLMRequestSerializer  
    permission_classes = [IsAuthenticated]  # Require the user to be authenticated

    def post(self, request, *args, **kwargs):
        # Deserialize and validate the incoming request data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Extract the question (user input) after validation
        category_input = serializer.validated_data['question']

        print(category_input)

        # Retrieve group UUIDs passed through the URL, defaulting to an empty string if not provided
        group_uuid_list = self.kwargs.get('group_uuid_list', '')
        
        # Fetch the user's transactions for the specified groups, only selecting relevant fields
        transactions_data = get_user_transactions_for_groups(
            request.user, group_uuid_list
        ).values('category', 'amount', 'description', 'start_date')
        
        # Format each transaction with a readable date string, if available
        transactions_data_list = [
            {
                'category': trans['category'],
                'amount': float(trans['amount']),  # Convert amount to float for LLM processing
                'description': trans['description'],
                'date': trans['start_date'].strftime('%Y-%m-%d') if trans['start_date'] else None
            }
            for trans in transactions_data
        ]

        # print(category_input)

        # Prepare a prompt for the LLM to generate new transactions, based on existing data and user question
        new_transaction_question = (
            f"From this data {transactions_data}\n\n and this subject and situations {category_input}\n\n"
            f"Can you provide 15 new transactions after {date.today()}? These should be representative of someone living in Kansas City, Missouri. Some should follow the trends of the existing "
            f"transactions as well as account for the subject and situations. If a situation relates to an "
            f"existing category then a new transaction in that category should be given a cost accordingly. "
            f"Please provide them as list of lists in the form new_transactions=[[]] with no additional information. Ensure the datetime.datetime format is used. Do NOT use a dictionary key value pair for data values such as 'category': 'Party'."
        )    

        # Process the prompt with the LLM to receive a response containing new transaction data
        transaction_answer = process_llm_prompt(new_transaction_question)
        # print("answer")
        # print(transaction_answer)

        stripped_str = re.sub('\n', '', transaction_answer)
        stripped_str = re.sub(r'^.*?\[', '[', stripped_str)
        stripped_str = re.sub(r'\]\](\s*.*?)$', ']]', stripped_str)

        # accounts for uncommon case where the str ends with ],]
        stripped_str = re.sub(r'\]\](\s*.*?)$', '],]', stripped_str)
        stripped_str = re.sub(r'\],\]', r']]', stripped_str)

        print("strip")
        print(stripped_str)
      
        # Parse the response into a list of transactions, enabling Decimal and datetime usage in the evaluation
        parsed_transactions = eval(
            stripped_str,
            {"Decimal": Decimal, "datetime": datetime}
        )

        # Reformat the parsed transactions to match the desired structure for further use
        cleaned_transactions = [
            {
                'category': transaction[0],
                'amount': float(transaction[1]),
                'description': transaction[2],
                'date': transaction[3].strftime('%Y-%m-%d')
            }
            for transaction in parsed_transactions
        ]

        # Merge existing transactions with new LLM-generated transactions for analysis
        merge = transactions_data_list + cleaned_transactions

        # Prepare a prompt for the LLM to evaluate spending trends and provide suggestions
        spending_evaluation_question = (
            f"Analyze and compare the transactions following today's date {date.today()} with those before it. "
            f"In one sentence explain any issues with spending and indicate if the costs exceed income. "
            f"In another sentence give a suggestion for resolving an issue if there is one. Here are the transactions {merge}"
        )

        # Process the evaluation prompt with the LLM and get the evaluation response
        evaluation_answer = process_llm_prompt(spending_evaluation_question)

        # Serialize the new transactions using LLMTransactionResponseSerializer
        transaction_serializer = LLMTransactionResponseSerializer(data=cleaned_transactions, many=True)
        transaction_serializer.is_valid(raise_exception=True)
        
        # Serialize the evaluation answer with LLMCharResponseSerializer
        evaluation_serializer = LLMCharResponseSerializer(data={'answer': evaluation_answer})
        evaluation_serializer.is_valid(raise_exception=True)

        # Combine both serialized responses into the final response payload
        response_data = {
            'new_transactions': transaction_serializer.data,
            'evaluation': evaluation_serializer.data,
        }

        # Return the combined response with HTTP 200 OK status
        return Response(response_data, status=status.HTTP_200_OK)