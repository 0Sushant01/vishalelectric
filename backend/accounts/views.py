from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, OTP
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer

class RegisterView(views.APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            otp_obj = OTP.objects.create(phone_number=user.phone_number)
            otp_obj.generate_code()
            return Response({
                "message": "OTP sent to your phone (check terminal)",
                "phone_number": user.phone_number
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(views.APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        code = request.data.get('code')
        
        try:
            otp_obj = OTP.objects.filter(phone_number=phone_number, code=code).latest('created_at')
            user = User.objects.get(phone_number=phone_number)
            user.is_active = True
            user.save()
            
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token
            access['refresh_jti'] = refresh['jti']
            
            response = Response({
                "user": UserSerializer(user).data,
                "message": "Verification successful"
            })
            
            response.set_cookie(
                key='access_token',
                value=str(access),
                httponly=True,
                secure=False, # Use True if HTTPS
                samesite='Lax'
            )
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                secure=False,
                samesite='Lax'
            )
            return response
        except (OTP.DoesNotExist, User.DoesNotExist):
            return Response({"error": "Invalid OTP or Phone Number"}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        password = request.data.get('password')
        
        user = authenticate(username=phone_number, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token
            access['refresh_jti'] = refresh['jti']
            
            response = Response({
                "user": UserSerializer(user).data
            })
            response.set_cookie(
                key='access_token',
                value=str(access),
                httponly=True,
                secure=False,
                samesite='Lax'
            )
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                secure=False,
                samesite='Lax'
            )
            return response
        return Response({"error": "Invalid credentials", "details": "Tags"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            response = Response({"message": "Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response
        except Exception as e:
            response = Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response

class AuthStatusView(views.APIView):
    # This endpoint gets pinged implicitly since the browser sends cookies automatically.
    # It allows the frontend to safely assert if the user is authenticated, and get their Role constraint.
    def get(self, request):
        if hasattr(request, "user") and request.user.is_authenticated:
            return Response({
                "is_authenticated": True,
                "user": UserSerializer(request.user).data
            })
        return Response({"is_authenticated": False}, status=status.HTTP_401_UNAUTHORIZED)

class UserProfileView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

class ProtectedTestView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": f"Hello {request.user.full_name}, you have accessed a protected endpoint!"})

from rest_framework_simplejwt.views import TokenRefreshView
from accounts.serializers import CustomTokenRefreshSerializer

class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        # We need to extract the refresh token from the cookie and inject it into request.data
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            # Safely create mutable copy or override if it's a QueryDict
            if hasattr(request.data, '_mutable'):
                request.data._mutable = True
            request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            if access_token:
                response.set_cookie(
                    key='access_token',
                    value=access_token,
                    httponly=True,
                    secure=False,
                    samesite='Lax'
                )
            
            refresh_token = response.data.get('refresh')
            if refresh_token:
                response.set_cookie(
                    key='refresh_token',
                    value=refresh_token,
                    httponly=True,
                    secure=False,
                    samesite='Lax'
                )

            # Do not return tokens in the standard body 
            response.data = {"message": "Token successfully refreshed"}

        return response
