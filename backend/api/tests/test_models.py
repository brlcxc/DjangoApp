from django.test import TestCase
from ..models import User, Group, Transaction, Invite
from uuid import uuid4

class UserModelTests(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(email="testuser@example.com", password="testpass123", display_name="Test User")
        self.assertEqual(user.email, "testuser@example.com")
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        superuser = User.objects.create_superuser(email="admin@example.com", password="adminpass123", display_name="Admin User")
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.is_staff)

class GroupModelTests(TestCase):
    def test_create_group(self):
        # Step 1: Create and save a User instance
        owner = User.objects.create_user(email="owner@example.com", password="testpass123", display_name="Group Owner")
        
        # Step 2: Create a Group instance with group_owner_id assigned to the created user
        group = Group.objects.create(group_name="Finance Group", group_owner_id=owner)
        
        # Step 3: Assert that group_owner_id is not null and is correctly set
        self.assertEqual(group.group_name, "Finance Group")
        self.assertEqual(group.group_owner_id, owner)

class TransactionModelTests(TestCase):
    def test_transaction_ordering(self):
        group = Group.objects.create(group_name="Finance Group")
        transaction1 = Transaction.objects.create(amount=100.00, start_date="2024-10-01", is_recurrent=False, frequency=1, group_id=group)
        transaction2 = Transaction.objects.create(amount=200.00, start_date="2024-10-02", is_recurrent=False, frequency=1, group_id=group)
        transactions = Transaction.objects.all()
        self.assertEqual(transactions[0], transaction1)
        self.assertEqual(transactions[1], transaction2)

class InviteModelTests(TestCase):
    def test_create_invite(self):
        sender = User.objects.create_user(email="sender@example.com", password="testpass123", display_name="Invite Sender")
        group = Group.objects.create(group_name="Social Club", group_owner_id=sender)
        invite = Invite.objects.create(content="You're invited!", sender_id=sender, group_id=group)
        self.assertEqual(invite.content, "You're invited!")
        self.assertEqual(invite.sender_id, sender)
