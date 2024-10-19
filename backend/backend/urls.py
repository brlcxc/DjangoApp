from django.contrib import admin
from django.urls import path, include
from api.views import UserCreateView
# pre built views for obtaining access and refresh tokens
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    # going to that specific route will call the specified view
    path("api/user/register/", UserCreateView.as_view(), name="register"),
    # obtains token
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    # refreshes token
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    # includes all urls from rest framework
    path("api-auth/", include("rest_framework.urls")),
    # we want to forward certain urls to the api urls file for better separation
    path("api/", include("api.urls")),
] 