from rest_framework import serializers

from apps.appointments.models import Appointment
from apps.patients.models import Patient
from .models import SessionNote


class SessionNoteSerializer(serializers.ModelSerializer):
    # TODO: Override create(), update(), and to_representation() to encrypt/decrypt
    # encrypted_content via cryptography.fernet. Never store or return plaintext.

    appointment_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.objects.all(), source='appointment'
    )
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient'
    )

    class Meta:
        model = SessionNote
        fields = [
            'id',
            'appointment_id',
            'patient_id',
            'date',
            'encrypted_content',
        ]
