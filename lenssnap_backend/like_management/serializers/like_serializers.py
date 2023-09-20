from rest_framework import serializers

from django.contrib.contenttypes.models import ContentType
from like_management.models import Like

from pin_management.models import Pin
from comment_management.models import Comment
from user_management.serializers import UserSerializerReadOnly


class LikeContentRelatedField(serializers.RelatedField):

    def to_internal_value(self, data):
        return data

    def to_representation(self, instance):

        if isinstance(instance, Pin):
            return instance.id

        if isinstance(instance, Comment):
            return instance.id

        raise Exception("unexpected type of like objs")


class LikeSerializer(serializers.ModelSerializer):

    content_object = LikeContentRelatedField(queryset=ContentType.objects.all())

    class Meta:
        model = Like
        fields = ('like_by', 'content_object')


class PinLikeSerializer(serializers.ModelSerializer):

    like_by = UserSerializerReadOnly()

    class Meta:
        model = Like
        fields = ('id', 'like_by', )
