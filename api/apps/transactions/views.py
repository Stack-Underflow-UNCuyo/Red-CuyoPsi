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
    # TODO: Filter by psychologist's appointment IDs and support ?month=YYYY-MM
    return Response([])
