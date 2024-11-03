from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .tokens import email_verification_token
from django.db.models import Q
from .models import Transaction, Group

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