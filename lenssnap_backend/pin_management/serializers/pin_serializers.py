from rest_framework import serializers

from pin_management.models import Pin


class PinSerializerReadOnly(serializers.ModelSerializer):

    class Meta:
        model = Pin
        fields = ('id', 'file', 'description', 'created_at',
                  'updated_at', 'created_by', 'updated_by')
        read_only_fields = fields
