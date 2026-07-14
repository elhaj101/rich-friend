from django.db import transaction
from rest_framework.response import Response
from rest_framework.views import APIView

from core.datauri import decode_data_url

from .models import WishlistItem

SLOTS = (1, 2, 3, 4, 5)


def serialize_wishlist(user, request) -> list[dict]:
    """Always exactly five slots, 1..5, matching the frontend contract."""
    rows = {item.priority: item for item in user.wishlist_items.all()}
    out = []
    for priority in SLOTS:
        item = rows.get(priority)
        photo = None
        if item and item.photo:
            photo = request.build_absolute_uri(item.photo.url)
        out.append({
            "priority": priority,
            "photo": photo,
            "title": (item.title or None) if item else None,
            "link": (item.link or None) if item else None,
            "note": (item.note or None) if item else None,
        })
    return out


class WishlistView(APIView):
    def get(self, request):
        return Response({"wishlist": serialize_wishlist(request.user, request)})

    @transaction.atomic
    def put(self, request):
        items = (request.data or {}).get("items")
        incoming = {}
        if isinstance(items, list):
            for raw in items:
                if isinstance(raw, dict) and raw.get("priority") in SLOTS:
                    incoming[raw["priority"]] = raw

        existing = {i.priority: i for i in request.user.wishlist_items.select_for_update()}
        for priority in SLOTS:
            raw = incoming.get(priority, {})
            item = existing.get(priority)
            title = str(raw.get("title") or "")[:200]
            link = str(raw.get("link") or "")[:500]
            note = str(raw.get("note") or "")
            photo_value = raw.get("photo")

            if item is None:
                item = WishlistItem(user=request.user, priority=priority)

            item.title, item.link, item.note = title, link, note

            # Photo semantics: data URL → replace file; falsy → clear;
            # any other string (the URL we served earlier) → keep as-is.
            if isinstance(photo_value, str) and photo_value.startswith("data:image/"):
                decoded = decode_data_url(photo_value)
                if decoded:
                    if item.photo:
                        item.photo.delete(save=False)
                    item.photo = decoded
            elif not photo_value:
                if item.photo:
                    item.photo.delete(save=False)
                item.photo = None

            item.save()

        return Response({"wishlist": serialize_wishlist(request.user, request)})
