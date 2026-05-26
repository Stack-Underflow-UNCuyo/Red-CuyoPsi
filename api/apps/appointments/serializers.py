from rest_framework import serializers

from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'id',
            'psychologist_id',
            'patient_id',
            'date_time',
            'status',
            'payment_status',
        ]
