from rest_framework import serializers

from apps.appointments.models import Appointment
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    appointment_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.objects.all(), source='appointment'
    )

    class Meta:
        model = Transaction
        fields = [
            'id',
            'appointment_id',
            'amount',
            'type',
            'status',
        ]
