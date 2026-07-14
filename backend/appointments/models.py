from django.conf import settings
from django.db import models


class Appointment(models.Model):
    """A consultation with a personal shopper (video or phone)."""

    class Kind(models.TextChoices):
        VIDEO_CALL = "video_call", "Video call"
        PHONE_CALL = "phone_call", "Phone call"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        COMPLETED = "completed", "Completed"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="appointments")
    kind = models.CharField(max_length=20, choices=Kind.choices)
    shopper = models.CharField(max_length=100, blank=True)
    scheduled_at = models.DateTimeField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["scheduled_at"]

    def __str__(self):
        return f"{self.get_kind_display()} · {self.user} · {self.scheduled_at:%Y-%m-%d %H:%M}"
