import django_filters

from .models import SessionNote


class SessionNoteFilter(django_filters.FilterSet):
    patient_id = django_filters.NumberFilter(field_name='patient')
    appointment_id = django_filters.NumberFilter(field_name='appointment')

    class Meta:
        model = SessionNote
        fields = ['patient_id', 'appointment_id']
