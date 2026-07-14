from django.conf import settings
from django.db import models

# Human-facing refs continue the mock's numbering (RF-2041, RF-2042, …).
REF_OFFSET = 2040


class Order(models.Model):
    """A sourcing request. Status vocabulary matches the frontend's five-stage
    timeline (frontend/src/lib/types.ts ORDER_STATUSES)."""

    class Status(models.TextChoices):
        REQUESTED = "requested", "Requested"
        SOURCING = "sourcing", "Sourcing"
        PURCHASED = "purchased", "Purchased"
        IN_TRANSIT = "in_transit", "In transit"
        DELIVERED = "delivered", "Delivered"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    ref = models.CharField(max_length=20, unique=True, blank=True, editable=False)
    item_name = models.CharField(max_length=200)
    brand = models.CharField(max_length=100)
    size = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=100, blank=True)
    budget = models.CharField(max_length=50, blank=True)
    destination_country = models.CharField(max_length=100)
    notes = models.TextField(blank=True)
    reference_photo = models.ImageField(upload_to="orders/%Y/%m/", blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.REQUESTED)
    shopper = models.CharField(max_length=100, blank=True)
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.ref} · {self.brand} {self.item_name}"

    @classmethod
    def from_db(cls, db, field_names, values):
        instance = super().from_db(db, field_names, values)
        instance._loaded_status = instance.status
        return instance

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        if not self.ref:
            self.ref = f"RF-{REF_OFFSET + self.pk}"
            super().save(update_fields=["ref"])
        # Keep an auditable status trail (initial status + every change),
        # regardless of whether the change came from the API, admin, or seeds.
        previous = getattr(self, "_loaded_status", None)
        if is_new or previous != self.status:
            OrderStatusEvent.objects.create(order=self, status=self.status)
        self._loaded_status = self.status


class OrderStatusEvent(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="status_history")
    status = models.CharField(max_length=20, choices=Order.Status.choices)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.order.ref} → {self.status}"
