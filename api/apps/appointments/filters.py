import django_filters

from .models import Appointment


class AppointmentFilter(django_filters.FilterSet):
    patient_id = django_filters.NumberFilter(field_name='patient')
    psychologist_id = django_filters.NumberFilter(field_name='psychologist')

    class Meta:
        model = Appointment
        fields = ['patient_id', 'psychologist_id', 'status']
