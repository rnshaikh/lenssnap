
from django.core.cache import cache
from django.db.models import Count

from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated

from user_management.models import User
from user_management.serializers import UserHomeTimeLineSerializer

from pin_management.models import Pin
from pin_management.serializers import PinSerializerReadOnly

from lenssnap_backend.custom_pagination import StandardPageNumberPagination
from lenssnap_backend.cache_utils import Cache

cache_obj = Cache()


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


class UserTimeLineView(viewsets.ModelViewSet):

    model = Pin
    permission_classes = (IsAuthenticated,)
    serializer_class = PinSerializerReadOnly
    queryset = Pin.objects.all()
    pagination_class = StandardPageNumberPagination

    def list(self, request):
        user = request.user.id
        cache.clear()
        user_cache = cache.get(user, None)
        if user_cache and user_cache.get('user_timeline'):
            pins = user_cache.get('user_timeline')
        else:
            following_ids = request.user.followers_by.all().values_list('followed_to', flat=True)
            pins = Pin.objects.select_related().filter(created_by__in=following_ids).annotate(likes_count=Count('likes', distinct=True),
                                                                                              comments_count=Count('comments', distinct=True)).order_by('-created_at')
            pins = PinSerializerReadOnly(pins, many=True)
            pins = pins.data
            cache_obj.load_user_data(request.user)

        page = self.paginate_queryset(pins)
        return Response({
            "msg": "user timeline fetched successfully",
            "data": self.get_paginated_response(page).data
        })
