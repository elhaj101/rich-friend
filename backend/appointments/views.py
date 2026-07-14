from rest_framework import status as http_status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Appointment
from .serializers import AppointmentSerializer

DEFAULT_SHOPPER = "Camille Laurent"


class AppointmentListCreateView(APIView):
    def get(self, request):
        appts = request.user.appointments.order_by("scheduled_at")
        return Response({"appointments": AppointmentSerializer(appts, many=True).data})

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        appt = serializer.save(user=request.user, shopper=DEFAULT_SHOPPER)
        return Response(
            {"appointment": AppointmentSerializer(appt).data},
            status=http_status.HTTP_201_CREATED,
        )
