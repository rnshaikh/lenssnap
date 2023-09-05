from django.core.cache import cache
from django.db.models import Prefetch, Count, Q
from django.shortcuts import get_object_or_404

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, viewsets
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser

from pin_management.models import Pin
from pin_management.serializers import PinSerializerReadOnly, PinSerializer
from pin_management.system_error import check_pin_update_error
from pin_management import utils

from comment_management.models import Comment
from comment_management.serializers import (PinCommentSerializer, )
from like_management.serializers import (PinLikeSerializer, )

from lenssnap_backend.cache_utils import Cache

cache_obj = Cache()


class PinList(viewsets.ModelViewSet):

    permission_classes = (IsAuthenticated,)
    serializer_class = PinSerializerReadOnly
    parser_classes = (JSONParser, FormParser, MultiPartParser)
    queryset = Pin.objects.all()
    model = Pin

    def list(self, request):
        user = request.query_params.get('user', None)
        if not user:
            user = request.user.id

        user_cache = cache.get(user, None)
        if user_cache and user_cache.get('home_timeline'):
            pins = user_cache.get('home_timeline')
        else:
            pins = Pin.objects.select_related().filter(
                    created_by=user
                    ).annotate(
                    likes_count=Count('likes', distinct=True),
                    comments_count=Count('comments', distinct=True),
                    is_liked=Count('likes', filter=Q(likes__like_by=user), distinct=True)
                    ).order_by('-created_at')
            pins = PinSerializerReadOnly(pins, many=True)
            pins = pins.data
            cache_obj.load_user_data(request.user)

        page = self.paginate_queryset(pins)
        return Response({
            "msg": "pin fetched successfully.",
            "data": self.get_paginated_response(page).data
        })

    def create(self, request):
        data = request.data
        data['created_by'] = request.user.id
        serializer = PinSerializer(data=data)
        if serializer.is_valid():
            obj = serializer.save()
            utils.update_cache_after_pin_creation(obj)
            return Response({
                "msg": "pin created successfully.",
                "data": serializer.data
            })
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def retrieve(self, request, pk):

        pins = Pin.objects.select_related().filter(id=pk).annotate(likes_count=Count('likes', distinct=True),
                                                                   comments_count=Count('comments', distinct=True))
        if pins:
            serializer = PinSerializerReadOnly(pins[0])
            return Response({
                "msg": "pin retrieved successfully.",
                "data": serializer.data
            })
        else:
            return Response({
                "msg": "Not Found.",
            }, status=status.HTTP_404_NOT_FOUND)

    def partial_update(self, request, pk):

        pin = get_object_or_404(Pin, id=pk)
        data = request.data
        data._mutable = True
        data['updated_by'] = request.user.id
        errors = check_pin_update_error(data, pin)
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = PinSerializer(pin, data=data, partial=True)
        if serializer.is_valid():
            obj = serializer.save()
            utils.update_cache_after_pin_updation(obj)
            return Response({
                "msg": "pin updated successfully.",
                "data": serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, pk):
        pin = get_object_or_404(Pin, id=pk)
        utils.cache_delete_pin(pin)
        pin.delete()
        return Response({
            "msg": "pin deleted successfully."
        })

    @action(detail=True, methods=['GET'])
    def comments(self, request, pk):

        pin = get_object_or_404(Pin, id=pk)
        comments = pin.comments.filter(parent=None).select_related().prefetch_related(
                    'replies',
                    ).annotate(likes_count=Count('likes', distinct=True)).order_by('-created_at')
        page = self.paginate_queryset(comments)
        serializer = PinCommentSerializer(page, many=True)
        return Response({
            "msg": "pin comments fetched successfully.",
            "data": self.get_paginated_response(serializer.data).data
        })

    @action(detail=True, methods=['GET'])
    def likes(self, request, pk):

        pin = get_object_or_404(Pin, id=pk)
        likes = pin.likes.select_related().order_by('-created_at')
        page = self.paginate_queryset(likes)
        serializer = PinLikeSerializer(page, many=True)
        return Response({
            "msg": "pin likes fetched successfully",
            "data": self.get_paginated_response(serializer.data).data
        })






