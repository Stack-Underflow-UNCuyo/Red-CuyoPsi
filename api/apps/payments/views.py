from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['POST'])
def payments_initiate(request):
    # TODO: Payment gateway integration — deferred sprint
    return Response(
        {'detail': 'Not implemented yet'},
        status=status.HTTP_501_NOT_IMPLEMENTED,
    )


@api_view(['POST'])
def payments_webhook(request):
    # TODO: Payment gateway callback handler — deferred sprint
    return Response(
        {'detail': 'Not implemented yet'},
        status=status.HTTP_501_NOT_IMPLEMENTED,
    )
