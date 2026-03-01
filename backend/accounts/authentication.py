from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed, InvalidToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken

class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom JWT Authentication that extracts the token from an HttpOnly cookie 
    instead of the Authorization header, and explicitly verifies the token against blacklisted parents.
    """
    def authenticate(self, request):
        header = self.get_header(request)
        
        # Try to get token from header first (for potential API testing flexibility)
        if header is not None:
            raw_token = self.get_raw_token(header)
        else:
            # Otherwise extract from cookie
            raw_token = request.COOKIES.get('access_token') or request.COOKIES.get('access')

        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
        
    def get_validated_token(self, raw_token):
        validated_token = super().get_validated_token(raw_token)
        
        refresh_jti = validated_token.get("refresh_jti")
        
        if not refresh_jti:
            raise InvalidToken("Missing refresh_jti claim. Please log in again to upgrade your token format.")
        
        is_blacklisted = BlacklistedToken.objects.filter(token__jti=refresh_jti).exists()
        if is_blacklisted:
            raise InvalidToken("The parent refresh token for this access token has been blacklisted.")
        
        return validated_token
