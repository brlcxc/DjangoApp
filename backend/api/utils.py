from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .tokens import email_verification_token
from django.db.models import Q
from .models import Transaction, Group
from rest_framework.response import Response
from rest_framework import status
import os
import vertexai
import json
from vertexai.generative_models import GenerativeModel
from google.oauth2 import service_account  # Importing service_account
from openai import OpenAI
import time
import re
from decimal import Decimal
import datetime
from datetime import date

def send_verification_email(user, request):
    # custom verification token with hashed user info
    token = email_verification_token.make_token(user)

    # converts uuid to bytes to prepare for encoding and then encodes to a url-safe base64 string
    # encoding is done so that the server can identify the user without exposing the raw user id
    uuid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # reverse constructs the url path
    verification_url = reverse('verify_email', kwargs={'uuidb64': uuid, 'token': token})
    
    # combines everything into full url
    verification_link = f"{request.scheme}://{request.get_host()}{verification_url}"
    
    send_mail(
        subject="Verify your email",
        message=f"Hi {user.display_name}, click the link to verify your email: {verification_link}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )

def get_user_transactions_for_groups(user, group_uuid_list):
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

def process_Gemini_llm_prompt(prompt):
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
            model = GenerativeModel("gemini-1.5-flash-002")
            start_time = time.time()
            response = model.generate_content([prompt])
            answer = response.text.strip()
            response_time = time.time() - start_time
            print("gemini")
            print(response_time)
            return answer
        except Exception as e:
            return Response({"error": f"Failed to generate response: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def process_GPT_llm_prompt(prompt):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    messages = [
            {"role": "user", "content": prompt},
        ]
    try:
        start_time = time.time()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0
        )
        answer = response.choices[0].message.content.strip()

        print("gpt")
        response_time = time.time() - start_time
        print(response_time)

        return answer
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

def process_str(llm_response):
    print(llm_response)
    
    stripped_str = re.sub('\n', '', llm_response)
    stripped_str = re.sub(r'^.*?\[', '[', stripped_str)
    stripped_str = re.sub(r'\]\](\s*.*?)$', ']]', stripped_str)

    # accounts for uncommon case where the str ends with ],]
    stripped_str = re.sub(r'\]\](\s*.*?)$', '],]', stripped_str)
    stripped_str = re.sub(r'\],\]', r']]', stripped_str)

    # removes instance of inner single quote such as with 'New Year's Eve Party'
    stripped_str = re.sub(r"(?<=\w)'(?=\w)", "", stripped_str)

    stripped_str = re.sub(r'```', '', stripped_str)

    try:
        parsed_transactions = eval(
            stripped_str,
            {"Decimal": Decimal, "datetime": datetime}
        )
    except (SyntaxError, NameError, TypeError, ValueError) as e:
        # Log the error or handle it if necessary
        print(f"Error during eval: {e}")
        print("input\n")
        print(llm_response)
        print("stripped\n")
        print(stripped_str)
        parsed_transactions = []  # Default value, can be adjusted as needed

    # Reformat the parsed transactions to match the desired structure for further use
    try:
        cleaned_transactions = [
            {
                'category': transaction[0],
                'amount': float(transaction[1]),
                'description': transaction[2],
                'date': transaction[3].strftime('%Y-%m-%d')
            }
            for transaction in parsed_transactions
        ]
    except (SyntaxError, NameError, TypeError, ValueError) as e:
        print(f"Error during clean: {e}")
        print("parsed\n")
        print(parsed_transactions)
        cleaned_transactions = []

    return cleaned_transactions

def perform_evaluation(existing_transactions, llm_transactions):
     # Merge existing transactions with new LLM-generated transactions for analysis
    merge = existing_transactions + llm_transactions

    # Prepare a prompt for the LLM to evaluate spending trends and provide suggestions
    spending_evaluation_question = (
        f"Analyze and compare the transactions following today's date {date.today()} with those before it. "
        f"In one sentence explain any issues with spending and indicate if the costs exceed income. "
        f"In another sentence give a suggestion for resolving an issue if there is one. Here are the transactions {merge}"
    )

    # Process the evaluation prompt with the LLM and get the evaluation response
    evaluation_answer = process_Gemini_llm_prompt(spending_evaluation_question)

    return evaluation_answer