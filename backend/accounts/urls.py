from django.urls import path
from .views import RegisterView, VerifyOTPView, LoginView, LogoutView, ProtectedTestView, UserProfileView, CustomTokenRefreshView, AuthStatusView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('auth-status/', AuthStatusView.as_view(), name='auth-status'),
    path('me/', UserProfileView.as_view(), name='me'),
    path('protected/', ProtectedTestView.as_view(), name='protected_test'),
]
