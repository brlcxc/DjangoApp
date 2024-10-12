from django.urls import path
from . import views

urlpatterns = [
    # for viewing or creating groups
    path("groups/", views.GroupListCreate.as_view(), name="group-list"),
    # for deleting groups
    path("groups/delete/<uuid:pk>/", views.GroupDelete.as_view(), name="delete-group"),
    path("user/retrieve/<uuid:pk>/", views.RetrieveUserView.as_view(), name="user-retrieve"),
]