from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from apps.patients.models import Patient
from apps.psychologists.models import Psychologist
from .tokens import CustomTokenObtainPairSerializer

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=['patient', 'psychologist'])
    phone = serializers.CharField(max_length=50, required=False, allow_blank=True)
    specialty = serializers.CharField(max_length=255, required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def validate(self, attrs):
        role = attrs.get('role')
        if role == 'patient' and not attrs.get('phone'):
            raise serializers.ValidationError({'phone': 'This field is required for patients.'})
        if role == 'psychologist' and not attrs.get('specialty'):
            raise serializers.ValidationError({'specialty': 'This field is required for psychologists.'})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        role = validated_data['role']
        email = validated_data['email']
        name = validated_data['name']

        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data['password'],
        )

        if role == 'patient':
            Patient.objects.create(
                user=user,
                name=name,
                email=email,
                phone=validated_data.get('phone', ''),
            )
        else:
            Psychologist.objects.create(
                user=user,
                name=name,
                specialty=validated_data.get('specialty', ''),
                session_price='0.00',
                payment_policy=Psychologist.PaymentPolicy.EXTERNAL,
            )

        token = CustomTokenObtainPairSerializer.get_token(user)
        return {
            'access': str(token.access_token),
            'refresh': str(token),
            'role': token.get('role'),
            'profile_id': token.get('profile_id'),
        }
