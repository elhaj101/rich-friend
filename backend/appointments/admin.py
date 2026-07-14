from django.contrib import admin

from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ["user", "kind", "shopper", "scheduled_at", "status", "created_at"]
    list_filter = ["kind", "status"]
    search_fields = ["user__email", "user__name", "shopper", "note"]
    date_hierarchy = "scheduled_at"
