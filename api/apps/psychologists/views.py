from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Psychologist
from .serializers import PsychologistSerializer


class PsychologistViewSet(viewsets.ModelViewSet):
    queryset = Psychologist.objects.all()
    serializer_class = PsychologistSerializer

    @action(detail=True, methods=['get'], url_path='availability')
    def availability(self, request, pk=None):
        # TODO: Return available time slots — query params: date_from, date_to (YYYY-MM-DD)
        return Response([])

    @action(detail=False, methods=['get'], url_path='nearby')
    def nearby(self, request):
        # TODO: Haversine proximity query — deferred sprint
        return Response(
            {'detail': 'Not implemented yet'},
            status=status.HTTP_501_NOT_IMPLEMENTED,
        )
