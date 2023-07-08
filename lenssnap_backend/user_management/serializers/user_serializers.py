from rest_framework import serializers
from user_management.models import User


class UserSerializerReadOnly(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'picture')
        read_only_fields = fields
