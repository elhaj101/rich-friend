from rest_framework import serializers

from .models import Order, OrderStatusEvent


class OrderSerializer(serializers.ModelSerializer):
    """Emits the frontend's camelCase Order shape."""

    id = serializers.CharField(read_only=True)
    itemName = serializers.CharField(source="item_name", max_length=200)
    brand = serializers.CharField(max_length=100)
    size = serializers.CharField(max_length=50, required=False, allow_blank=True)
    color = serializers.CharField(max_length=100, required=False, allow_blank=True)
    budget = serializers.CharField(max_length=50, required=False, allow_blank=True)
    destinationCountry = serializers.CharField(source="destination_country", max_length=100)
    notes = serializers.CharField(required=False, allow_blank=True)
    referencePhoto = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "ref", "itemName", "brand", "size", "color", "budget",
            "destinationCountry", "notes", "referencePhoto", "status",
            "shopper", "createdAt", "updatedAt",
        ]
        read_only_fields = ["ref", "status", "shopper"]

    def get_referencePhoto(self, obj):
        if not obj.reference_photo:
            return None
        url = obj.reference_photo.url
        request = self.context.get("request")
        return request.build_absolute_uri(url) if request else url


class OrderStatusEventSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = OrderStatusEvent
        fields = ["status", "note", "createdAt"]


class AdminOrderUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.Status.choices, required=False)
    note = serializers.CharField(required=False, allow_blank=True)
    shopper = serializers.CharField(max_length=100, required=False, allow_blank=True)
    adminNotes = serializers.CharField(required=False, allow_blank=True)
