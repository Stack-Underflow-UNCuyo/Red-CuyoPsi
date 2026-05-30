from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        if hasattr(user, 'patient_profile') and user.patient_profile is not None:
            token['role'] = 'patient'
            token['profile_id'] = user.patient_profile.id
        elif hasattr(user, 'psychologist_profile') and user.psychologist_profile is not None:
            token['role'] = 'psychologist'
            token['profile_id'] = user.psychologist_profile.id
        else:
            token['role'] = None
            token['profile_id'] = None
        return token
