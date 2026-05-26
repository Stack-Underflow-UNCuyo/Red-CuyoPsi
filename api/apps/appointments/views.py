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
        # TODO: Implement via appointments/services.py — handle notifications and refund logic
        return Response({})

    @action(detail=True, methods=['patch'], url_path='confirm')
    def confirm(self, request, pk=None):
        # TODO: Implement via appointments/services.py — validate psychologist.payment_policy first
        return Response({})
