from django.urls import reverse, resolve
from django.test import SimpleTestCase
from api import views

class URLTests(SimpleTestCase):
    def test_group_list_create_url_resolves(self):
        url = reverse('group-list-create')
        self.assertEqual(resolve(url).func.view_class, views.GroupListCreate)

    def test_group_retrieve_update_destroy_url_resolves(self):
        url = reverse('group-retrieve-update-destroy', args=['123e4567-e89b-12d3-a456-426614174000'])
        self.assertEqual(resolve(url).func.view_class, views.GroupRetrieveUpdateDestroyView)

    def test_transaction_create_url_resolves(self):
        url = reverse('transaction-create', args=['123e4567-e89b-12d3-a456-426614174000'])
        self.assertEqual(resolve(url).func.view_class, views.TransactionCreate)

    def test_transaction_list_url_resolves(self):
        url = reverse('transaction-list', args=['123e4567-e89b-12d3-a456-426614174000,234e5678-f90b-12d3-a456-426614175000'])
        self.assertEqual(resolve(url).func.view_class, views.TransactionList)

    def test_transaction_retrieve_update_destroy_url_resolves(self):
        url = reverse('transaction-retrieve-update-destroy', args=['123e4567-e89b-12d3-a456-426614174000'])
        self.assertEqual(resolve(url).func.view_class, views.TransactionRetrieveUpdateDestroyView)

    def test_invite_create_url_resolves(self):
        url = reverse('invite-create', args=['123e4567-e89b-12d3-a456-426614174000', '234e5678-f90b-12d3-a456-426614175000'])
        self.assertEqual(resolve(url).func.view_class, views.InviteCreateView)

    def test_verify_email_url_resolves(self):
        url = reverse('verify_email', args=['123e4567e89b12d3a456426614174000', 'sometoken'])
        self.assertEqual(resolve(url).func.view_class, views.VerifyEmail)

    def test_llm_ask_url_resolves(self):
        url = reverse('llm-ask')
        self.assertEqual(resolve(url).func.view_class, views.LLMCategoryResponseView)

    def test_llm_ask_transactions_url_resolves(self):
        url = reverse('llm-ask-transactions', args=['123e4567-e89b-12d3-a456-426614174000,234e5678-f90b-12d3-a456-426614175000'])
        self.assertEqual(resolve(url).func.view_class, views.LLMTransactionResponseView)
