from django.urls import path
from . import views

urlpatterns = [
    # User URLs
    path('users/', views.UserListView.as_view(), name='user-list'),  # List all users

    # Group URLs
    path('groups/', views.GroupListCreate.as_view(), name='group-list-create'),  # List all groups or create a new group
    path('groups/<uuid:pk>/', views.GroupRetrieveUpdateDestroyView.as_view(), name='group-retrieve-update-destroy'),  # Retrieve, update, or destroy a specific group

    # Transaction URLs
    path('groups/<uuid:group_uuid>/transactions/', views.TransactionCreate.as_view(), name='transaction-create'),  # Create a transaction in a specific group
    path('transactions/<str:group_uuid_list>/', views.TransactionList.as_view(), name='transaction-list'),  # List transactions for one or more groups
    path('transactions/<uuid:pk>/', views.TransactionRetrieveUpdateDestroyView.as_view(), name='transaction-retrieve-update-destroy'),  # Retrieve, update, or destroy a specific transaction

    # Invite URLs
    path('groups/<uuid:group_uuid>/invites/<str:recipient_uuids>/', views.InviteCreateView.as_view(), name='invite-create'),  # Create an invite for multiple recipients in a group

    # User verification URL
    path('verify-email/<uuidb64>/<token>/', views.VerifyEmail.as_view(), name='verify_email'),  #idk

    # LLM URLs
    path('llm/ask/', views.LLMCategoryResponseView.as_view(), name='llm-ask'),  # Endpoint for sending a category question to the LLM
    path('llm/ask/<str:group_uuid_list>/', views.LLMTransactionResponseView.as_view(), name='llm-ask-transactions'),  # Endpoint for sending a transaction question to the LLM
]