from rest_framework import serializers
from comment_management.models import Comment
from django.contrib.contenttypes.models import ContentType
from pin_management.models import Pin
from user_management.serializers import UserSerializerReadOnly


class CommentObjectRelatedField(serializers.RelatedField):

    def to_internal_value(self, data):
        return data

    def to_representation(self, value):
        if isinstance(value, Pin):
            return value.id

        raise Exception("unexpected type of comment objs")


class CommentSerializer(serializers.ModelSerializer):

    content_object = CommentObjectRelatedField(queryset=ContentType.objects.all())

    class Meta:
        model = Comment
        fields = ('id', 'content',
                  'parent', 'content_object',
                  'created_by', 'updated_by')


class CommentSerializerReadOnly(serializers.ModelSerializer):

    content_object = CommentObjectRelatedField(read_only=True)
    created_by = UserSerializerReadOnly()
    updated_by = UserSerializerReadOnly()

    class Meta:
        model = Comment
        fields = ('id', 'content', 'parent', 'content_object',
                  'created_by', 'updated_by')
        read_only_fields = fields


class CommentUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ('id', 'created_by', 'updated_by', 'content')
        read_only_fields = ('id', 'created_by')


class PinCommentSerializer(serializers.ModelSerializer):

    replies = serializers.SerializerMethodField()
    created_by = UserSerializerReadOnly()
    updated_by = UserSerializerReadOnly()
    likes_count = serializers.IntegerField(required=False)
    is_liked = serializers.IntegerField(required=False)

    class Meta:
        model = Comment
        fields = ('id', 'content', 'created_by', 'created_at',
                  'updated_by', 'updated_at', 'replies',
                  'likes_count', 'is_liked')
        read_only_fields = fields

    def get_replies(self, instance):

        objs = instance.replies.all()[:3]
        return PinCommentSerializer(objs, many=True).data

