from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from lenssnap_backend.model_mixins import CreatedInfo, UpdatedInfo


class Comment(CreatedInfo, UpdatedInfo):

    content = models.CharField(max_length=255)
    parent = models.ForeignKey('self', blank=True, null=True,
                               on_delete=models.CASCADE,
                               related_name='replies')
    content_type = models.ForeignKey(ContentType,
                                     on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
