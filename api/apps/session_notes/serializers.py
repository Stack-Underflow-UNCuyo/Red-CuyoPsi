from rest_framework import serializers

from .models import SessionNote


class SessionNoteSerializer(serializers.ModelSerializer):
    # TODO: Override create(), update(), and to_representation() to encrypt/decrypt
    # encrypted_content via cryptography.fernet. Never store or return plaintext.

    class Meta:
        model = SessionNote
        fields = '__all__'
