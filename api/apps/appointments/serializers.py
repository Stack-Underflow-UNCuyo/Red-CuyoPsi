from rest_framework import serializers

from apps.patients.models import Patient
from apps.psychologists.models import Psychologist
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    psychologist_id = serializers.PrimaryKeyRelatedField(
        queryset=Psychologist.objects.all(), source='psychologist'
    )
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient'
    )

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
