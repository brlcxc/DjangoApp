from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from .models import User, Group, Transaction
from uuid import uuid4


class UserViewTests(APITestCase):
    def setUp(self):
        self.user_data = {"email": "testuser@example.com", "password": "password123"}
        self.user = User.objects.create_user(**self.user_data)
        self.client.force_authenticate(user=self.user)

    def test_user_create(self):
        response = self.client.post(reverse("user-create"), self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_retrieve(self):
        response = self.client.get(reverse("user-retrieve-update-destroy"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_update(self):
        updated_data = {"display_name": "Updated User"}
        response = self.client.patch(reverse("user-retrieve-update-destroy"), updated_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["display_name"], updated_data["display_name"])

    def test_user_delete(self):
        response = self.client.delete(reverse("user-retrieve-update-destroy"))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class GroupViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="user1@example.com", password="password123")
        self.group = Group.objects.create(group_name="Test Group", group_owner_id=self.user)
        self.client.force_authenticate(user=self.user)

    def test_group_list_create(self):
        response = self.client.get(reverse("group-list-create"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        new_group_data = {"group_name": "New Group", "description": "A new group for testing"}
        response = self.client.post(reverse("group-list-create"), new_group_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_group_retrieve_update_delete(self):
        url = reverse("group-retrieve-update-destroy", kwargs={"pk": self.group.group_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.patch(url, {"group_name": "Updated Group"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["group_name"], "Updated Group")

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TransactionViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="user1@example.com", password="password123")
        self.group = Group.objects.create(group_name="Test Group", group_owner_id=self.user)
        self.transaction = Transaction.objects.create(
            group_id=self.group,
            amount=100.0,
            category="Groceries",
            description="Grocery shopping"
        )
        self.client.force_authenticate(user=self.user)

    def test_transaction_create(self):
        url = reverse("transaction-create", kwargs={"group_uuid": self.group.group_id})
        transaction_data = {
            "amount": 50.0,
            "category": "Utilities",
            "description": "Electricity bill"
        }
        response = self.client.post(url, transaction_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_transaction_list(self):
        group_uuid_list = f"{self.group.group_id}"
        url = reverse("transaction-list", kwargs={"group_uuid_list": group_uuid_list})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_transaction_retrieve_update_delete(self):
        url = reverse("transaction-retrieve-update-destroy", kwargs={"pk": self.transaction.transaction_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.patch(url, {"amount": 150.0})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["amount"], 150.0)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class InviteViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="user1@example.com", password="password123")
        self.recipient = User.objects.create_user(email="recipient@example.com", password="password123")
        self.group = Group.objects.create(group_name="Test Group", group_owner_id=self.user)
        self.client.force_authenticate(user=self.user)

    def test_invite_create(self):
        url = reverse("invite-create", kwargs={"group_uuid": self.group.group_id, "recipient_uuids": str(self.recipient.pk)})
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class EmailVerificationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="user1@example.com", password="password123", user_verified=False)
        self.token = email_verification_token.make_token(self.user)
        self.uuidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))

    def test_email_verification(self):
        url = reverse("verify_email", kwargs={"uuidb64": self.uuidb64, "token": self.token})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.user_verified)


class LLMTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="user1@example.com", password="password123")
        self.group = Group.objects.create(group_name="Test Group", group_owner_id=self.user)
        self.client.force_authenticate(user=self.user)

    def test_llm_category_response(self):
        url = reverse("llm-ask")
        data = {"question": "What are common financial challenges?"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_llm_transaction_response(self):
        group_uuid_list = f"{self.group.group_id}"
        url = reverse("llm-ask-transactions", kwargs={"group_uuid_list": group_uuid_list})
        data = {"question": "How do we handle unexpected expenses?"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
