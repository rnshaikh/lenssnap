
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated

from user_management.models import User
from user_management.serializers import UserSerializerReadOnly


class UserProfileView(viewsets.ModelViewSet):

    model = User
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializerReadOnly
    queryset = User.objects.all()

    def list(self, request):

        user = request.user
        serializer = UserSerializerReadOnly(user)

        return Response({
            "msg": "user detail fetch successfully",
            "data": serializer.data
            })

    def create(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)




