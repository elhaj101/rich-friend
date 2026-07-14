from rest_framework import serializers

from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    scheduledAt = serializers.DateTimeField(source="scheduled_at")
    note = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Appointment
        fields = ["id", "kind", "shopper", "scheduledAt", "status", "note"]
        read_only_fields = ["shopper", "status"]
