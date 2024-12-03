from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import User, Group, Transaction, Invite

User = get_user_model()

class GroupIntegrationTests(APITestCase):
    def setUp(self):
        # Create test users
        self.owner = User.objects.create_user(email="owner@example.com", password="password123", display_name="Owner")
        self.member = User.objects.create_user(email="member@example.com", password="password123", display_name="Member")

        # Authenticate as the owner
        self.client.login(email="owner@example.com", password="password123")

    def test_create_group_and_add_member(self):
        # Step 1: Create a group
        group_data = {"group_name": "Test Group", "description": "A test group"}
        response = self.client.post('/groups/', group_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        group_id = response.data['group_id']

        # Step 2: Add a member to the group
        add_member_data = {"user_id": self.member.id}
        add_member_response = self.client.post(f'/groups/{group_id}/add_member/', add_member_data)

        self.assertEqual(add_member_response.status_code, status.HTTP_200_OK)

        # Verify the member was added
        group = Group.objects.get(group_id=group_id)
        self.assertIn(self.member, group.members.all())

class TransactionIntegrationTests(APITestCase):
    def setUp(self):
        # Create test user and group
        self.user = User.objects.create_user(email="user@example.com", password="password123", display_name="Test User")
        self.group = Group.objects.create(group_name="Test Group", group_owner_id=self.user)
        self.client.login(email="user@example.com", password="password123")

    def test_create_and_list_transactions(self):
        # Step 1: Create a transaction
        transaction_data = {
            "category": "Groceries",
            "amount": "50.00",
            "description": "Weekly shopping",
            "start_date": "2024-01-01T10:00:00Z",
            "is_recurrent": False,
            "frequency": 0,
        }
        create_response = self.client.post(f'/groups/{self.group.group_id}/transactions/', transaction_data)
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)

        # Step 2: List transactions for the group
        list_response = self.client.get(f'/groups/{self.group.group_id}/transactions/')
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.data), 1)
        self.assertEqual(list_response.data[0]['category'], "Groceries")

class InviteIntegrationTests(APITestCase):
    def setUp(self):
        # Create users and group
        self.sender = User.objects.create_user(email="sender@example.com", password="password123", display_name="Sender")
        self.recipient = User.objects.create_user(email="recipient@example.com", password="password123", display_name="Recipient")
        self.group = Group.objects.create(group_name="Test Group", group_owner_id=self.sender)
        self.client.login(email="sender@example.com", password="password123")

    def test_send_invite(self):
        # Step 1: Send an invite
        invite_data = {"content": "Please join my group!", "recipients": [self.recipient.id]}
        response = self.client.post(f'/groups/{self.group.group_id}/invites/{self.recipient.id}/', invite_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Step 2: Validate the invite exists
        self.assertEqual(self.recipient.received_invites.count(), 1)
        invite = self.recipient.received_invites.first()
        self.assertEqual(invite.group_id, self.group)
        self.assertEqual(invite.content, "Please join my group!")

class LLMIntegrationTests(APITestCase):
    def setUp(self):
        # Create user and group
        self.user = User.objects.create_user(email="user@example.com", password="password123", display_name="User")
        self.group = Group.objects.create(group_name="Test Group", group_owner_id=self.user)
        self.client.login(email="user@example.com", password="password123")

    def test_llm_transaction_response(self):
        # Step 1: Create transactions for the group
        Transaction.objects.create(
            category="Utilities", amount="75.00", description="Electric bill",
            start_date="2024-01-01T10:00:00Z", is_recurrent=False, frequency=0, group_id=self.group
        )
        Transaction.objects.create(
            category="Groceries", amount="100.00", description="Weekly groceries",
            start_date="2024-01-02T10:00:00Z", is_recurrent=False, frequency=0, group_id=self.group
        )

        # Step 2: Ask LLM for insights
        response = self.client.get(f'/llm/ask/{self.group.group_id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Utilities", response.data['insights'])
