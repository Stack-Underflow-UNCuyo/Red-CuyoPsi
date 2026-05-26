from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets

from .filters import SessionNoteFilter
from .models import SessionNote
from .serializers import SessionNoteSerializer


class SessionNoteViewSet(viewsets.ModelViewSet):
    # Ordered descending so clinical history shows newest first
    queryset = SessionNote.objects.all().order_by('-date')
    serializer_class = SessionNoteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = SessionNoteFilter
