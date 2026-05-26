from rest_framework import serializers

from .models import Psychologist


class PsychologistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Psychologist
        fields = [
            'id',
            'name',
            'specialty',
            'session_price',
            'payment_policy',
            'modality',
            'rating',
            'address',
            'latitude',
            'longitude',
        ]
