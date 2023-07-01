from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, viewsets
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser

from pin_management.models import Pin
from pin_management.serializers import PinSerializerReadOnly, PinSerializer


class PinList(viewsets.ModelViewSet):

    permission_classes = (IsAuthenticated,)
    serializer_class = PinSerializerReadOnly
    parser_classes = (JSONParser, FormParser, MultiPartParser)
    queryset = Pin.objects.all()
    model = Pin

    def list(self, request):

        pins = Pin.objects.filter()
        page = self.paginate_queryset(pins)
        serializer = PinSerializerReadOnly(page, many=True)

        return Response({
            "msg": "pin fetched successfully.",
            "data": self.get_paginated_response(serializer.data).data
        })

    def create(self, request):

        data = request.data
        data['created_by'] = request.user
        serializer = PinSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "msg": "pin created successfully.",
                "data": serializer.data
            })
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def retrieve(self, request, pk):

        pin = get_object_or_404(Pin, id=pk)
        serializer = PinSerializerReadOnly(pin)
        return Response({
            "msg": "pin retrieved successfully.",
            "data": serializer.data
        })

    def partial_update(self, request, pk):

        pin = get_object_or_404(Pin, id=pk)
        data = request.data
        data['updated_by'] = request.user
        serializer = PinSerializer(pin, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "msg": "pin updated successfully.",
                "data": serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def delete(self, request, pk):
        pin = get_object_or_404(Pin, id=pk)
        pin.delete()
        return Response({
            "msg": "pin deleted successfully."
        })
