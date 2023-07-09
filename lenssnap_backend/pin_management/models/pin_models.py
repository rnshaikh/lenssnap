from django.db import models
from django.contrib.contenttypes.fields import GenericRelation
from lenssnap_backend.model_mixins import CreatedInfo, UpdatedInfo
from comment_management.models import Comment
from like_management.models import Like


def user_directory_path(instance, filename):

    return 'user_{0}/{1}'.format(instance.created_by.id,
                                 filename)


class Pin(CreatedInfo, UpdatedInfo):

    file = models.FileField(upload_to=user_directory_path)
    description = models.CharField(max_length=256, blank=True, null=True)

    comments = GenericRelation(Comment)
    likes = GenericRelation(Like)

    class Meta:
        ordering = ('-created_at', )

