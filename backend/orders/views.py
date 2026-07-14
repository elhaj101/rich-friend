from django.shortcuts import get_object_or_404
from rest_framework import status as http_status
from rest_framework.response import Response
from rest_framework.views import APIView

from config.exceptions import ApiError
from core.datauri import decode_data_url
from core.permissions import IsAdmin

from .models import Order, OrderStatusEvent
from .serializers import (
    AdminOrderUpdateSerializer,
    OrderSerializer,
    OrderStatusEventSerializer,
)

DEFAULT_SHOPPER = "Camille Laurent"


def visible_orders(user):
    qs = Order.objects.all()
    return qs if getattr(user, "role", None) == "ADMIN" else qs.filter(user=user)


class OrderListCreateView(APIView):
    def get(self, request):
        orders = visible_orders(request.user).order_by("-created_at")
        data = OrderSerializer(orders, many=True, context={"request": request}).data
        return Response({"orders": data})

    def post(self, request):
        serializer = OrderSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        photo = decode_data_url((request.data or {}).get("referencePhoto"))
        order = serializer.save(
            user=request.user,
            shopper=DEFAULT_SHOPPER,
            reference_photo=photo,
        )
        data = OrderSerializer(order, context={"request": request}).data
        return Response({"order": data}, status=http_status.HTTP_201_CREATED)


class OrderDetailView(APIView):
    def get_object(self, request, pk):
        return get_object_or_404(visible_orders(request.user), pk=pk)

    def get(self, request, pk):
        order = self.get_object(request, pk)
        history = OrderStatusEventSerializer(order.status_history.all(), many=True).data
        data = OrderSerializer(order, context={"request": request}).data
        return Response({"order": data, "statusHistory": history})

    def patch(self, request, pk):
        # Concierge staff only: advance status / assign shopper / annotate.
        if not IsAdmin().has_permission(request, self):
            raise ApiError("unauthorized", http_status.HTTP_403_FORBIDDEN)
        order = get_object_or_404(Order, pk=pk)
        serializer = AdminOrderUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        v = serializer.validated_data

        if "status" in v:
            order.status = v["status"]
        if "shopper" in v:
            order.shopper = v["shopper"]
        if "adminNotes" in v:
            order.admin_notes = v["adminNotes"]
        order.save()
        if v.get("note"):
            # Attach the note to the event the save just wrote (or add one).
            event = order.status_history.order_by("-created_at").first()
            if event and not event.note:
                event.note = v["note"]
                event.save(update_fields=["note"])
            else:
                OrderStatusEvent.objects.create(order=order, status=order.status, note=v["note"])

        data = OrderSerializer(order, context={"request": request}).data
        return Response({"order": data})
