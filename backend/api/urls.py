from django.urls import path
from . import views

urlpatterns = [
    # User URLs
    path('users/', views.UserCreateView.as_view(), name='user-create'),  # Create a user
    path('users/me/', views.UserRetrieveUpdateDestroyView.as_view(), name='user-retrieve-update-destroy'),  # Retrieve, update, or destroy current user

    # Group URLs
    path('groups/', views.GroupListCreate.as_view(), name='group-list-create'),  # List all groups or create a new group
    path('groups/<uuid:pk>/', views.GroupRetrieveUpdateDestroyView.as_view(), name='group-retrieve-update-destroy'),  # Retrieve, update, or destroy a specific group

    # Transaction URLs
    path('groups/<uuid:group_uuid>/transactions/', views.TransactionCreate.as_view(), name='transaction-create'),  # Create a transaction in a specific group
    path('transactions/<str:group_uuid_list>/', views.TransactionList.as_view(), name='transaction-list'),  # List transactions for one or more groups
    path('transactions/<uuid:pk>/', views.TransactionRetrieveUpdateDestroyView.as_view(), name='transaction-retrieve-update-destroy'),  # Retrieve, update, or destroy a specific transaction

    # Invite URLs
    path('groups/<uuid:group_uuid>/invites/<str:recipient_uuids>/', views.InviteCreateView.as_view(), name='invite-create'),  # Create an invite for multiple recipients in a group
]