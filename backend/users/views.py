import re

from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from config.exceptions import ApiError

from .models import User
from .serializers import PublicUserSerializer
from .services import create_account, create_guest_account

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def tokens_for(user: User) -> dict:
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


def auth_payload(user: User) -> dict:
    return {"user": PublicUserSerializer(user).data, **tokens_for(user)}


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data if isinstance(request.data, dict) else {}
        name = str(data.get("name") or "").strip()
        email = str(data.get("email") or "").strip().lower()
        password = str(data.get("password") or "")

        if not name or not email or not password:
            raise ApiError("missing_fields")
        if not EMAIL_RE.match(email):
            raise ApiError("invalid_email")
        if len(password) < 8:
            raise ApiError("weak_password")
        if User.objects.filter(email=email).exists():
            raise ApiError("email_taken", status.HTTP_409_CONFLICT)

        user = create_account(name, email, password)
        return Response(auth_payload(user), status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data if isinstance(request.data, dict) else {}
        email = str(data.get("email") or "").strip().lower()
        password = str(data.get("password") or "")
        if not email or (not password and not settings.DEMO_AUTH):
            raise ApiError("missing_fields")

        if settings.DEMO_AUTH:
            # Demo parity with the mock: any credentials work. Existing account
            # is returned regardless of password; unknown email creates one.
            user = User.objects.filter(email=email).first()
            if user is None:
                name = email.split("@")[0] or "Member"
                user = create_account(name, email, password or "demo-password")
        else:
            user = authenticate(request, username=email, password=password)
            if user is None:
                raise ApiError("invalid_credentials", status.HTTP_401_UNAUTHORIZED)

        return Response(auth_payload(user))


class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data if isinstance(request.data, dict) else {}
        token = str(data.get("refresh") or "")
        if not token:
            raise ApiError("unauthorized", status.HTTP_401_UNAUTHORIZED)
        try:
            refresh = RefreshToken(token)
        except TokenError:
            raise ApiError("unauthorized", status.HTTP_401_UNAUTHORIZED)
        return Response({"access": str(refresh.access_token)})


class GuestView(APIView):
    """Demo-mode only: provision an anonymous seeded account."""

    permission_classes = [AllowAny]

    def post(self, request):
        if not settings.DEMO_AUTH:
            raise ApiError("unauthorized", status.HTTP_403_FORBIDDEN)
        user = create_guest_account()
        return Response(auth_payload(user), status=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"user": PublicUserSerializer(request.user).data})
