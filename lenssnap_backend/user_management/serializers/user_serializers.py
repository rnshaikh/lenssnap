from rest_framework import serializers
from user_management.models import User, Follower


class UserSerializerReadOnly(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'picture')
        read_only_fields = fields


class FollowerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Follower
        fields = ('id', 'followed_by', 'followed_to')


class FollowerSerializerReadOnly(serializers.ModelSerializer):

    followed_by = UserSerializerReadOnly()

    class Meta:
        model = Follower
        fields = ('id', 'followed_by')
        read_only_fields = fields


class FollowingSerializerReadOnly(serializers.ModelSerializer):

    followed_to = UserSerializerReadOnly()

    class Meta:
        model = Follower
        fields = ('id', 'followed_to')
        read_only_fields = fields


class UserHomeTimeLineSerializer(serializers.ModelSerializer):

    followers_count = serializers.IntegerField()
    following_count = serializers.IntegerField()
    pins_count = serializers.IntegerField()

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'picture',
                  'bio', 'followers_count', 'following_count', 'pins_count')
