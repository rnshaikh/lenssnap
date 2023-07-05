from rest_framework import serializers
from comment_management.models import Comment
from django.contrib.contenttypes.models import ContentType
from pin_management.models import Pin


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


