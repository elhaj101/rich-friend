from django.contrib import admin

from .models import Order, OrderStatusEvent


class OrderStatusEventInline(admin.TabularInline):
    model = OrderStatusEvent
    extra = 0
    readonly_fields = ["created_at"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["ref", "item_name", "brand", "user", "status", "shopper", "destination_country", "created_at"]
    list_filter = ["status", "destination_country", "brand"]
    search_fields = ["ref", "item_name", "brand", "user__email", "user__name"]
    readonly_fields = ["ref", "created_at", "updated_at"]
    inlines = [OrderStatusEventInline]
    date_hierarchy = "created_at"


@admin.register(OrderStatusEvent)
class OrderStatusEventAdmin(admin.ModelAdmin):
    list_display = ["order", "status", "note", "created_at"]
    list_filter = ["status"]
    search_fields = ["order__ref", "note"]
