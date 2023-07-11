from django.shortcuts import get_object_or_404

from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from like_management.models import Like
from like_management.serializers import LikeSerializer
from like_management.system_error import check_like_creation_error

from comment_management.models import Comment
from pin_management.models import Pin


class LikeList(viewsets.ModelViewSet):

    model = Like
    permission_classes = (IsAuthenticated, )
    serializer_class = LikeSerializer
    queryset = Like.objects.all()
    content_type_map = {'pin': Pin, 'comment': Comment}

    def create(self, request):

        data = request.data
        data['like_by'] = request.user.id
        error = check_like_creation_error(data)
        if error:
            return Response(error, status=status.HTTP_400_BAD_REQUEST)

        content_type = self.content_type_map.get(data.get('content_type'))
        obj = get_object_or_404(content_type, id=data.get('content_object'))

        try:
            like_obj = obj.likes.get(like_by=request.user)
            like_obj.delete()
            return Response({
                "msg": "likes delete successfully"
            })
        except Like.DoesNotExist:
            pass

        data['content_object'] = obj
        serializer = LikeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "msg": "Liked successfully",
                "data": serializer.data
            })
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)
