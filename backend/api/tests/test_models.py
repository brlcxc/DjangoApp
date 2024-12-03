from django.test import TestCase
from django.utils.timezone import now, timedelta
from ..models import User, Group, Transaction, Invite
from uuid import UUID


class UserModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="testuser@example.com", password="securepassword", display_name="Test User"
        )
    
    def test_user_creation(self):
        self.assertIsInstance(self.user.id, UUID)
        self.assertEqual(self.user.email, "testuser@example.com")
        self.assertEqual(self.user.display_name, "Test User")
        self.assertFalse(self.user.user_verified)
    
    def test_superuser_creation(self):
        superuser = User.objects.create_superuser(
            email="admin@example.com", password="superpassword", display_name="Admin User"
        )
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)


class GroupModelTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            email="owner@example.com", password="password", display_name="Group Owner"
        )
        self.group = Group.objects.create(
            group_name="Test Group", description="A test group", group_owner_id=self.owner
        )
        self.member = User.objects.create_user(
            email="member@example.com", password="password", display_name="Group Member"
        )
        self.group.members.add(self.member)
    
    def test_group_creation(self):
        self.assertIsInstance(self.group.group_id, UUID)
        self.assertEqual(self.group.group_name, "Test Group")
        self.assertEqual(self.group.description, "A test group")
        self.assertEqual(self.group.group_owner_id, self.owner)
        self.assertIn(self.member, self.group.members.all())


class TransactionModelTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            email="owner@example.com", password="password", display_name="Group Owner"
        )
        self.group = Group.objects.create(
            group_name="Transaction Group", description="Group for transactions", group_owner_id=self.owner
        )
        self.transaction = Transaction.objects.create(
            category="Groceries",
            amount=50.75,
            description="Weekly groceries",
            start_date=now(),
            end_date=now() + timedelta(days=1),
            is_recurrent=False,
            frequency=0,
            group_id=self.group
        )
    
    def test_transaction_creation(self):
        self.assertIsInstance(self.transaction.transaction_id, UUID)
        self.assertEqual(self.transaction.category, "Groceries")
        self.assertEqual(self.transaction.amount, 50.75)
        self.assertEqual(self.transaction.description, "Weekly groceries")
        self.assertEqual(self.transaction.group_id, self.group)
        self.assertFalse(self.transaction.is_recurrent)
        self.assertEqual(self.transaction.frequency, 0)


class InviteModelTests(TestCase):
    def setUp(self):
        self.sender = User.objects.create_user(
            email="sender@example.com", password="password", display_name="Invite Sender"
        )
        self.recipient = User.objects.create_user(
            email="recipient@example.com", password="password", display_name="Invite Recipient"
        )
        self.group = Group.objects.create(
            group_name="Invite Group", description="Group for invites", group_owner_id=self.sender
        )
        self.invite = Invite.objects.create(
            content="You are invited to join our group!", sender_id=self.sender, group_id=self.group
        )
        self.invite.recipients.add(self.recipient)
    
    def test_invite_creation(self):
        self.assertIsInstance(self.invite.invite_id, UUID)
        self.assertEqual(self.invite.content, "You are invited to join our group!")
        self.assertEqual(self.invite.sender_id, self.sender)
        self.assertEqual(self.invite.group_id, self.group)
        self.assertIn(self.recipient, self.invite.recipients.all())