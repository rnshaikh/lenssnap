from django.db import models
from lenssnap_backend.model_mixins import CreatedInfo, UpdatedInfo


def user_directory_path(instance, filename):

    return 'user_{0}/{1}'.format(instance.created_by.id,
                                 filename)


class Pin(CreatedInfo, UpdatedInfo):

    file = models.FileField(upload_to=user_directory_path)
    description = models.CharField(max_length=256, blank=True, null=True)

    class Meta:
        ordering = ('-created_at', )

