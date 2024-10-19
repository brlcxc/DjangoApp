from django.contrib import admin
from django.urls import path, include
from api.views import UserCreateView, UserRetrieveUpdateDestroyView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView  # pre built views for obtaining access and refresh tokens

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/users/register/', UserCreateView.as_view(), name='user-register'),  # Create a user
    path('api/users/me/', UserRetrieveUpdateDestroyView.as_view(), name='user-retrieve-update-destroy'),  # Retrieve, update, or destroy current user
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),  # obtains token
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),  # refreshes token
    path("api-auth/", include("rest_framework.urls")),  # includes all urls from rest framework
    path("api/", include("api.urls")),  # we want to forward certain urls to the api urls file for better separation
] 