from django.urls import path
from .views import SignupAPI, ProfileAPI
from django.contrib.auth.views import LogoutView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', SignupAPI.as_view(), name = 'signup'),
    path('login/', TokenObtainPairView.as_view(), name = 'login'),
    path('logout/', LogoutView.as_view(template_name = 'users/logout.html'), name = 'logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileAPI.as_view(), name="user_profile"),

]