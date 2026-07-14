from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health(_request):
    return JsonResponse({"ok": True})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),
    path("api/auth/", include("users.auth_urls")),
    path("api/users/", include("users.urls")),
    path("api/orders/", include("orders.urls")),
    path("api/appointments/", include("appointments.urls")),
    path("api/wishlist/", include("wishlist.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
