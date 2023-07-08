
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

from comment_management.models import Comment
from comment_management.serializers import (CommentSerializer,
                                            CommentSerializerReadOnly,
                                            CommentUpdateSerializer,
                                            PinCommentSerializer)
from comment_management.system_error import (comment_creation_error_check,
                                             comment_updation_error_check)

from pin_management.models import Pin
from lenssnap_backend import error_conf


class CommentViewset(viewsets.ModelViewSet):

    permission_classes = (IsAuthenticated, )
    serializer_class = CommentSerializerReadOnly
    queryset = Comment.objects.all()
    model = Comment
    content_type_map = {"pin": Pin}

    def list(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def create(self, request):

        data = request.data
        data['created_by'] = request.user.id
        content_type = self.content_type_map.get(data.get('content_type'))
        data['content_type'] = content_type

        error = comment_creation_error_check(data)

        if error:
            return Response(error, status=status.HTTP_400_BAD_REQUEST)

        serializer = CommentSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "msg": "comment created successfully.",
                "data": serializer.data
            })

        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)

    def update(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, pk):

        data = request.data
        data['updated_by'] = request.user.id
        comment = get_object_or_404(Comment, id=pk)
        error = comment_updation_error_check(request, comment)
        if error:
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        serializer = CommentUpdateSerializer(comment, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "msg": "comment updated successfully.",
                "data": serializer.data
            })
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):

        comment = get_object_or_404(Comment, id=pk)

        if comment.created_by != request.user:
            return error_conf.CANT_UPDATE

        comment.delete()
        return Response({
            "msg": "comment deleted successfully.",
        })

    @action(detail=True, methods=['GET'])
    def replies(self, request, pk):

        comment = get_object_or_404(Comment, id=pk)
        replies = comment.replies.filter().order_by('-created_at')
        page = self.paginate_queryset(replies)
        serializer = PinCommentSerializer(page, many=True)
        return Response({
            "msg": "comments fetch successfully",
            "data": self.get_paginated_response(serializer.data).data
        })
