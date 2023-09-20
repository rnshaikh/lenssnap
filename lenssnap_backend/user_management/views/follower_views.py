
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import action

from rest_framework.permissions import IsAuthenticated

from user_management.models import Follower
from user_management.serializers import (FollowerSerializer,
                                         FollowerSerializerReadOnly,
                                         FollowingSerializerReadOnly)
from user_management.system_error import check_follower_error

from lenssnap_backend.custom_pagination import StandardPageNumberPagination


class FollowerList(viewsets.ModelViewSet):

    model = Follower
    permission_classes = (IsAuthenticated, )
    queryset = Follower.objects.all()
    serializer_class = FollowerSerializer
    pagination_class = StandardPageNumberPagination

    def create(self, request):

        data = request.data
        data['followed_by'] = request.user.id
        error = check_follower_error(data)

        if error:
            return Response(error, status=status.HTTP_400_BAD_REQUEST)

        serializer = FollowerSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "msg": "give user followed successfully.",
                "data": serializer.data
            })
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def unfollow(self, request):

        data = request.data
        followed_to = data.get('followed_to', None)
        obj = get_object_or_404(Follower, followed_to=followed_to,
                                followed_by=request.user.id)
        obj.delete()
        return Response({
            "msg": "given user unfollowed successfully.",
        })

    @action(detail=False, methods=['GET'])
    def following(self, request):

        user = request.user.id
        user_param = request.query_params.get('user', None)
        if user_param:
            user = user_param

        followings = Follower.objects.select_related('followed_by',
                                                     'followed_to').filter(followed_by=user).order_by('-created_at')
        page = self.paginate_queryset(followings)
        serializer = FollowingSerializerReadOnly(page, many=True)
        return Response({
            "msg": "followings fetched successfully",
            "data": self.get_paginated_response(serializer.data).data
            })

    def list(self, request):

        user = request.user.id
        user_param = request.query_params.get('user', None)
        if user_param:
            user = user_param

        followers = Follower.objects.select_related('followed_by',
                                                    'followed_to').filter(followed_to=user).order_by('-created_at')
        page = self.paginate_queryset(followers)
        serializer = FollowerSerializerReadOnly(page, many=True)
        return Response({
            "msg": "followers fetched successfully",
            "data": self.get_paginated_response(serializer.data).data
            })

    def update(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)











