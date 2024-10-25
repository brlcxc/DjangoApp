# why is it called password rest and how can this be utilized later?
from django.contrib.auth.tokens import PasswordResetTokenGenerator


class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    # why is this done
    def _make_hash_value(self, user, timestamp):
        return (
            str(user.pk) + str(timestamp) + str(user.user_verified)
        )

email_verification_token = EmailVerificationTokenGenerator()