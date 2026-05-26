import django_filters

from .models import Transaction


class TransactionFilter(django_filters.FilterSet):
    appointment_id = django_filters.NumberFilter(field_name='appointment')

    class Meta:
        model = Transaction
        fields = ['appointment_id']
