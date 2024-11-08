from rest_framework.test import APITestCase
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Group, Transaction, Invite
from .serializers import (
    UserSerializer,
    GroupSerializer,
    TransactionSerializer,
    InviteSerializer,
    LLMRequestSerializer,
    LLMResponseSerializer,
)
import datetime

User = get_user_model()


class UserSerializerTest(APITestCase):
    def setUp(self):
        self.user_data = {
            "email": "testuser@example.com",
            "password": "StrongP@ssw0rd!",
            "display_name": "Test User",
        }

    def test_valid_user_serializer(self):
        serializer = UserSerializer(data=self.user_data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.email, self.user_data["email"])

    def test_user_serializer_password_validation(self):
        self.user_data["password"] = "short"
        serializer = UserSerializer(data=self.user_data)
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)


class GroupSerializerTest(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(email="owner@example.com", password="OwnerP@ssw0rd")
        self.member = User.objects.create_user(email="member@example.com", password="MemberP@ssw0rd")
        self.group_data = {
            "group_name": "Test Group",
            "description": "A sample group",
            "group_owner_id": self.owner.id,
            "members": [self.member.id],
        }

    def test_valid_group_serializer(self):
        serializer = GroupSerializer(data=self.group_data)
        serializer.is_valid()
        group = serializer.save(group_owner_id=self.owner)
        self.assertEqual(group.group_name, self.group_data["group_name"])
        self.assertIn(self.member, group.members.all())

    def test_group_owner_read_only(self):
        serializer = GroupSerializer(data=self.group_data)
        serializer.is_valid()
        group = serializer.save(group_owner_id=self.owner)
        self.assertEqual(group.group_owner_id, self.owner)


class TransactionSerializerTest(APITestCase):
    def setUp(self):
        self.group = Group.objects.create(group_name="Finance", description="Finance Group", group_owner_id=User.objects.create_user(email="owner@example.com", password="OwnerP@ssw0rd"))
        self.transaction_data = {
            "category": "Food",
            "amount": 100,
            "description": "Groceries",
            "start_date": timezone.now().date(),
            "end_date": timezone.now().date() + datetime.timedelta(days=7),
            "is_recurrent": False,
            "frequency": "weekly",
            "group_id": self.group.group_id,
        }

    def test_valid_transaction_serializer(self):
        serializer = TransactionSerializer(data=self.transaction_data)
        self.assertTrue(serializer.is_valid())
        transaction = serializer.save(group_id=self.group)
        self.assertEqual(transaction.category, self.transaction_data["category"])
        self.assertEqual(transaction.amount, self.transaction_data["amount"])

    def test_group_id_read_only(self):
        serializer = TransactionSerializer(data=self.transaction_data)
        serializer.is_valid()
        transaction = serializer.save(group_id=self.group)
        self.assertEqual(transaction.group_id, self.group)


class InviteSerializerTest(APITestCase):
    def setUp(self):
        self.sender = User.objects.create_user(email="sender@example.com", password="SenderP@ssw0rd")
        self.recipient = User.objects.create_user(email="recipient@example.com", password="RecipientP@ssw0rd")
        self.invite_data = {
            "content": "You're invited to join the group!",
            "sender_id": self.sender.id,
            "recipients": [self.recipient.id],
        }

    def test_valid_invite_serializer(self):
        serializer = InviteSerializer(data=self.invite_data)
        serializer.is_valid()
        invite = serializer.save(sender_id=self.sender)
        self.assertEqual(invite.content, self.invite_data["content"])
        self.assertIn(self.recipient, invite.recipients.all())

    def test_sender_id_read_only(self):
        serializer = InviteSerializer(data=self.invite_data)
        serializer.is_valid()
        invite = serializer.save(sender_id=self.sender)
        self.assertEqual(invite.sender_id, self.sender)


class LLMRequestSerializerTest(APITestCase):
    def test_valid_llm_request_serializer(self):
        data = {"question": "What is the budget for this month?"}
        serializer = LLMRequestSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["question"], data["question"])

    def test_question_max_length(self):
        data = {"question": "a" * 501}  # Exceeds max length of 500
        serializer = LLMRequestSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("question", serializer.errors)


class LLMResponseSerializerTest(APITestCase):
    def test_valid_llm_response_serializer(self):
        data = {"answer": "The budget for this month is $5000."}
        serializer = LLMResponseSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["answer"], data["answer"])
