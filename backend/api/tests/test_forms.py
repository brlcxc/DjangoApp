from django.test import TestCase
from .forms import CustomUserCreationForm
from .models import User

class CustomUserCreationFormTest(TestCase):
    def setUp(self):
        self.valid_data = {
            "email": "newuser@example.com",
            "display_name": "New User",
            "password1": "StrongP@ssw0rd!",
            "password2": "StrongP@ssw0rd!",
        }
        self.invalid_password_data = {
            "email": "newuser@example.com",
            "display_name": "New User",
            "password1": "StrongP@ssw0rd!",
            "password2": "DifferentP@ssw0rd!",
        }

    def test_form_valid_data(self):
        form = CustomUserCreationForm(data=self.valid_data)
        self.assertTrue(form.is_valid())
        user = form.save()
        self.assertEqual(user.email, self.valid_data["email"])
        self.assertTrue(user.check_password(self.valid_data["password1"]))

    def test_form_password_mismatch(self):
        form = CustomUserCreationForm(data=self.invalid_password_data)
        self.assertFalse(form.is_valid())
        self.assertIn("password2", form.errors)
        self.assertEqual(form.errors["password2"], ["Passwords don't match"])

    def test_form_email_required(self):
        data = self.valid_data.copy()
        data.pop("email")
        form = CustomUserCreationForm(data=data)
        self.assertFalse(form.is_valid())
        self.assertIn("email", form.errors)

    def test_form_display_name_required(self):
        data = self.valid_data.copy()
        data.pop("display_name")
        form = CustomUserCreationForm(data=data)
        self.assertFalse(form.is_valid())
        self.assertIn("display_name", form.errors)

    def test_save_creates_user(self):
        form = CustomUserCreationForm(data=self.valid_data)
        self.assertTrue(form.is_valid())
        user = form.save(commit=True)
        self.assertIsNotNone(user.id)
        self.assertTrue(User.objects.filter(email=self.valid_data["email"]).exists())
