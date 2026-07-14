"""Decode the frontend's data-URL photo uploads into Django files.

The order form and wishlist send images as `data:image/<fmt>;base64,...`
strings (see frontend/src/lib/imageResize.ts — client-side resized, so
payloads are small). We persist them as real media files and serialize back
absolute URLs, which the frontend renders identically in <img src>.
"""

import base64
import binascii
import uuid

from django.core.files.base import ContentFile

# Generous ceiling; the client resizes to well under this.
MAX_BYTES = 8 * 1024 * 1024

ALLOWED_FORMATS = {"jpeg": "jpg", "jpg": "jpg", "png": "png", "webp": "webp", "gif": "gif"}


def decode_data_url(data_url: str) -> ContentFile | None:
    """Return a ContentFile for a valid image data URL, else None."""
    if not isinstance(data_url, str) or not data_url.startswith("data:image/"):
        return None
    try:
        header, _, b64 = data_url.partition(",")
        fmt = header.removeprefix("data:image/").split(";")[0].lower()
        ext = ALLOWED_FORMATS.get(fmt)
        if not ext or not b64:
            return None
        raw = base64.b64decode(b64, validate=True)
    except (ValueError, binascii.Error):
        return None
    if not raw or len(raw) > MAX_BYTES:
        return None
    return ContentFile(raw, name=f"{uuid.uuid4().hex}.{ext}")
