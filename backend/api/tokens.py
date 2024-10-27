# PasswordResetTokenGenerator is primarily used for resting passwords but it can be repurposed to have other functionalities such as verification
from django.contrib.auth.tokens import PasswordResetTokenGenerator

class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    # overridden to return information regarding verifying rather than what is needed to reset a password
    def _make_hash_value(self, user, timestamp):
        # The purpose of hashing is so that an attacker cannot reverse-engineer the token to obtain sensitive information
        # by adding the timestamp into the hash the token becomes time sensitive
        # by adding user verified to the hash this token will be invalidated  and cannot be reused once the user is validated
        return (
            str(user.pk) + str(timestamp) + str(user.user_verified)
        )

email_verification_token = EmailVerificationTokenGenerator()