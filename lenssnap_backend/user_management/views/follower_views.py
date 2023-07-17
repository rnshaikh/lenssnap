
from django.shortcuts import get_object_or_404
from django.db.models import Count, Sum

from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import action

from rest_framework.permissions import IsAuthenticated

from user_management.models import (Follower, User)
from user_management.serializers import (FollowerSerializer,
                                         FollowerSerializerReadOnly,
                                         FollowingSerializerReadOnly,
                                         UserHomeTimeLineSerializer)
from user_management.system_error import check_follower_error

from lenssnap_backend.custom_pagination import StandardPageNumberPagination


class HomeTimeLineView(viewsets.ModelViewSet):

    model = User
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer = UserHomeTimeLineSerializer

    def list(self, request):

        user = request.user.id
        user_param = request.query_params.get('user', None)
        if user_param:
            user = user_param

        users = User.objects.filter(id=user).annotate(
            pins_count=Count('created_pins__id', distinct=True),
            following_count=Count('followers_by__id', distinct=True),
            followers_count=Count('followers_to__id', distinct=True)
        )
        user = users[0]
        serializer = UserHomeTimeLineSerializer(user)
        return Response({
            "msg": "user hometimeline fetched successfully.",
            "data": serializer.data
        })

    def create(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)



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

        followings = Follower.objects.select_related('followed_by',
                                                     'followed_to').filter(followed_by=request.user).order_by('-created_at')
        page = self.paginate_queryset(followings)
        serializer = FollowingSerializerReadOnly(page, many=True)
        return Response({
            "msg": "followings fetched successfully",
            "data": self.get_paginated_response(serializer.data).data
            })

    def list(self, request):

        followers = Follower.objects.select_related('followed_by',
                                                    'followed_to').filter(followed_to=request.user).order_by('-created_at')
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











