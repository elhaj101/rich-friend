"""Account provisioning + the demo seed data every new account starts with.

Mirrors frontend/src/lib/server/mockStore.ts seedUserData(): two orders in
different lifecycle stages and one upcoming confirmed appointment, so the
dashboard demonstrates status tracking on first sign-in. Gated by the
SEED_NEW_USERS env (turn off in production).
"""

import uuid
from datetime import timedelta

from django.conf import settings
from django.utils import timezone

from appointments.models import Appointment
from orders.models import Order, OrderStatusEvent

from .models import User

DEFAULT_SHOPPER = "Camille Laurent"


def create_account(name: str, email: str, password: str, *, is_guest: bool = False) -> User:
    user = User.objects.create_user(email=email, password=password, name=name, is_guest=is_guest)
    if settings.SEED_NEW_USERS:
        seed_user_data(user)
    return user


def create_guest_account() -> User:
    suffix = uuid.uuid4().hex[:8]
    return create_account(
        "Guest", f"guest_{suffix}@richfriend.local", uuid.uuid4().hex, is_guest=True
    )


def seed_user_data(user: User) -> None:
    now = timezone.now()

    o1 = Order.objects.create(
        user=user,
        item_name="Classic Flap Bag, medium",
        brand="Chanel",
        color="Emerald caviar / gold hardware",
        budget="€9,500",
        destination_country="Qatar",
        notes="Prefer the emerald if available in caviar leather.",
        status=Order.Status.IN_TRANSIT,
        shopper=DEFAULT_SHOPPER,
    )
    o2 = Order.objects.create(
        user=user,
        item_name="Tambour Street Diver watch",
        brand="Louis Vuitton",
        color="Blue dial",
        budget="€3,200",
        destination_country="Qatar",
        status=Order.Status.DELIVERED,
        shopper=DEFAULT_SHOPPER,
    )
    # Backdate so "created 9 days ago / updated yesterday" reads naturally.
    Order.objects.filter(pk=o1.pk).update(
        created_at=now - timedelta(days=9), updated_at=now - timedelta(days=1)
    )
    Order.objects.filter(pk=o2.pk).update(
        created_at=now - timedelta(days=34), updated_at=now - timedelta(days=20)
    )
    OrderStatusEvent.objects.filter(order__in=[o1, o2]).update(
        created_at=now - timedelta(days=9)
    )

    scheduled = (now + timedelta(days=3)).replace(hour=16, minute=0, second=0, microsecond=0)
    Appointment.objects.create(
        user=user,
        kind=Appointment.Kind.VIDEO_CALL,
        shopper=DEFAULT_SHOPPER,
        scheduled_at=scheduled,
        status=Appointment.Status.CONFIRMED,
        note="Live walk-through of the autumn arrivals at the Paris boutique.",
    )
