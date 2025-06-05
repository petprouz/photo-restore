from django.urls import path
from .views import UserRegistrationView, UserLoginView, GoogleAuthView, UserDetailView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('google-auth/', GoogleAuthView.as_view(), name='google-auth'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
] 