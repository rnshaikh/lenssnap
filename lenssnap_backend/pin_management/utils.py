from django.core.cache import cache

from pin_management.serializers import PinSerializerReadOnly

from lenssnap_backend.cache_utils import Cache

cache_obj = Cache()


def update_cache_after_pin_creation(obj):

    user_id = obj.created_by.id
    user_cache = cache.get(user_id)

    if user_cache:
        pin_data = PinSerializerReadOnly(obj).data
        user_cache['home_timeline'] = [pin_data] + user_cache['home_timeline']
        cache.set(user_id, user_cache)
        follower_ids = user_cache['follower_ids']

        for id in follower_ids:
            u_cache = cache.get(id)
            if u_cache:
                user_timeline = u_cache.get('user_timeline', None)
                if user_timeline:
                    u_cache['user_timeline'] = [pin_data] + user_timeline
                    cache.set(id, u_cache)

    else:
        cache_obj.load_user_data(obj.created_by)


def cache_delete_pin(obj):

    user_id = obj.created_by.id
    user_cache = cache.get(user_id)
    pin_data = PinSerializerReadOnly(obj).data

    if user_cache:
        for i in range(0, len(user_cache['home_timeline'])):
            if user_cache['home_timeline'][i]['id'] == pin_data['id']:
                del user_cache['home_timeline'][i]
                cache.set(user_id, user_cache)
                break

        follower_ids = user_cache['follower_ids']

        for id in follower_ids:
            u_cache = cache.get(id)
            if u_cache:
                user_timeline = u_cache.get('user_timeline', None)
                if user_timeline:
                    for i in range(0, len(user_timeline)):
                        if u_cache['user_timeline'][i]['id'] == pin_data['id']:
                            del u_cache['user_timeline'][i]
                            cache.set(id, u_cache)
                            break
    else:
        cache_obj.load_user_data(obj.created_by)


def update_cache_after_pin_updation(obj):

    cache_delete_pin(obj)
    update_cache_after_pin_creation(obj)





