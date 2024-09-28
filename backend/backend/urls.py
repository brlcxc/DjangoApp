from django.contrib import admin
from django.urls import path, include
# CreateUser view we just created
from api.views import CreateUserView
# pre built views for obtaining access and refresh tokens
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    # going to that specific route will call the specified view
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    # obtains token
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    # refreshes token
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    # includes all urls from rest framework
    path("api-auth/", include("rest_framework.urls")),
    # makes it so remainder of path is fowarded to be handled elsewhere
    # why though? - to seperate roots better?
    path("api/", include("api.urls")),
] 

# we want to foward certain urls to the api urls file