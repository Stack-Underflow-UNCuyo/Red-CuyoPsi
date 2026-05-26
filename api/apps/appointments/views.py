from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .filters import AppointmentFilter
from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = AppointmentFilter

    @action(detail=True, methods=['patch'], url_path='cancel')
    def cancel(self, request, pk=None):
        # TODO: move notification and refund logic to appointments/services.py
        appointment = self.get_object()
        appointment.status = Appointment.Status.CANCELED
        appointment.save(update_fields=['status'])
        return Response(AppointmentSerializer(appointment).data)

    @action(detail=True, methods=['patch'], url_path='confirm')
    def confirm(self, request, pk=None):
        # TODO: move payment_policy validation to appointments/services.py
        appointment = self.get_object()
        appointment.status = Appointment.Status.CONFIRMED
        appointment.save(update_fields=['status'])
        return Response(AppointmentSerializer(appointment).data)
