from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, viewsets

from pin_management.models import Pin
from pin_management.serializers import PinSerializerReadOnly


class PinList(viewsets.ModelViewSet):

    permission_classes = (IsAuthenticated,)
    serializer_class = PinSerializerReadOnly
    model = Pin

    def list(self, request):

        pins = Pin.objects.filter()
        page = self.paginate_queryset(pins)
        serializer = PinSerializerReadOnly(page, many=True)

        return Response({
            "msg": "pin fetched successfully.",
            "data": self.get_paginated_response(serializer.data).data
        })


