from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class WishlistItem(models.Model):
    """One of the member's five ranked wishlist slots (1 = top priority).
    Slots exist implicitly; a row is only stored once a slot has content."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wishlist_items")
    priority = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    photo = models.ImageField(upload_to="wishlist/%Y/%m/", blank=True, null=True)
    title = models.CharField(max_length=200, blank=True)
    link = models.URLField(max_length=500, blank=True)
    note = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["priority"]
        constraints = [
            models.UniqueConstraint(fields=["user", "priority"], name="unique_user_priority"),
        ]

    def __str__(self):
        return f"{self.user} · slot {self.priority} · {self.title or '(empty)'}"
