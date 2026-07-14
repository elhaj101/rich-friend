from rest_framework import serializers

from .models import User


class PublicUserSerializer(serializers.ModelSerializer):
    """Matches the frontend's User shape: { id, name, email }."""

    id = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "name", "email"]
