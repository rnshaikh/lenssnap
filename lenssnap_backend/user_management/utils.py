from django.db.models import Count, Q

from user_management.models import User
from pin_management.models import Pin
from pin_management.serializers import PinSerializerReadOnly


def get_user_ids():

    ids = User.objects.all().values_list('id', flat=True)
    ids = list(ids)
    return ids


def get_followers_ids(user_id):

    user = User.objects.filter(id=user_id)
    if not user:
        return []
    user = user[0]
    ids = user.followers_to.all().values_list('followed_by', flat=True)
    ids = list(ids)
    return ids


def get_home_timeline(user_id):

    pins = Pin.objects.select_related().filter(
                created_by=user_id
            ).annotate(
            likes_count=Count('likes', distinct=True),
            comments_count=Count('comments', distinct=True),
            is_liked=Count('likes', filter=Q(likes__like_by=user_id), distinct=True)
            ).order_by('-created_at')
    serializer = PinSerializerReadOnly(pins, many=True)
    return serializer.data


def get_user_timeline(user_id):

    user = User.objects.filter(id=user_id)
    if not user:
        return []
    user = user[0]
    following_ids = user.followers_by.all().values_list('followed_to', flat=True)
    pins = Pin.objects.filter(
                created_by__in=following_ids
            ).annotate(
                likes_count=Count('likes', distinct=True),
                comments_count=Count('comments', distinct=True),
                is_liked=Count('likes', filter=Q(likes__like_by=user_id), distinct=True)
            ).order_by('-created_at')
    serializer = PinSerializerReadOnly(pins, many=True)
    return serializer.data
