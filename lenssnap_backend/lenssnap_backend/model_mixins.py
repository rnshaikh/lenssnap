from django.db import models
from user_management.models import User


class CreatedInfo(models.Model):

    created_by = models.ForeignKey(User,
                                   blank=True, null=True,
                                   on_delete=models.CASCADE,
                                   related_name='created_%(class)ss')
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        abstract = True


class UpdatedInfo(models.Model):

    updated_by = models.ForeignKey(User,
                                   blank=True, null=True,
                                   on_delete=models.CASCADE,
                                   related_name='updated_%(class)ss')
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        abstract = True

