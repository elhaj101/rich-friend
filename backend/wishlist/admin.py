from django.contrib import admin

from .models import WishlistItem


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ["user", "priority", "title", "link", "updated_at"]
    list_filter = ["priority"]
    search_fields = ["user__email", "user__name", "title"]
