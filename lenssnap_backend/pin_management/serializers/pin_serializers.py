from rest_framework import serializers

from pin_management.models import Pin
from user_management.serializers import UserSerializerReadOnly


class PinSerializerReadOnly(serializers.ModelSerializer):

    created_by = UserSerializerReadOnly()
    updated_by = UserSerializerReadOnly()
    likes_count = serializers.IntegerField(required=False)
    comments_count = serializers.IntegerField(required=False)

    class Meta:
        model = Pin
        fields = ('id', 'file', 'description', 'created_at',
                  'updated_at', 'created_by', 'updated_by',
                  'likes_count', 'comments_count')
        read_only_fields = fields


class PinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pin
        fields = ('id', 'file', 'description', 'comments', 'created_at',
                  'updated_at', 'created_by', 'updated_by')
        read_only_fields = ('id', 'created_at', 'updated_at')
