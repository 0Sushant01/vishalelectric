from rest_framework import serializers
from .models import User, OTP

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('unique_id', 'role', 'phone_number', 'full_name')

class RegisterSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('phone_number', 'full_name', 'password', 'password_confirm')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        user.is_active = False # Require OTP verification
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)

from rest_framework_simplejwt.serializers import TokenRefreshSerializer

class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        refresh = self.token_class(attrs["refresh"])
        
        if "refresh" in data:
            new_refresh = self.token_class(data["refresh"])
            refresh_jti = new_refresh.payload["jti"]
        else:
            refresh_jti = refresh.payload["jti"]
            
        access_token = refresh.access_token
        access_token["refresh_jti"] = refresh_jti
        
        data["access"] = str(access_token)
        return data
