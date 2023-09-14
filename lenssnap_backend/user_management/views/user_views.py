
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated

from rest_framework.decorators import action

from user_management.models import User
from user_management.serializers import UserSerializerReadOnly

from lenssnap_backend.custom_pagination import StandardPageNumberPagination


class UserProfileView(viewsets.ModelViewSet):

    model = User
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializerReadOnly
    pagination_class = StandardPageNumberPagination
    queryset = User.objects.all()

    def list(self, request):

        following_list = request.user.followers_by.all().values_list('followed_to__id', flat=True)
        users = User.objects.exclude(
                id__in=following_list
                ).all()

        page = self.paginate_queryset(users)
        serializer = UserSerializerReadOnly(page, many=True)

        return Response({
            "msg": "user detail fetch successfully",
            "data": self.get_paginated_response(serializer.data).data
            })

    def create(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(detail=False, methods=['GET'])
    def profile(self, request):
        user = request.user
        serializer = UserSerializerReadOnly(user)

        return Response({
            "msg": "user detail fetch successfully",
            "data": serializer.data
            })



