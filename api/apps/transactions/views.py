from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .filters import TransactionFilter
from .models import Transaction
from .serializers import TransactionSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = TransactionFilter


@api_view(['GET'])
def psychologist_transactions(request, psychologist_id: int):
    qs = Transaction.objects.filter(appointment__psychologist_id=psychologist_id)
    month = request.query_params.get('month')
    if month:
        qs = qs.filter(appointment__date_time__startswith=month)
    return Response(TransactionSerializer(qs, many=True).data)
