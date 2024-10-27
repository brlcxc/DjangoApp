from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .tokens import email_verification_token

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