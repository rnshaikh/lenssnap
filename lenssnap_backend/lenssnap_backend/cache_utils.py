from django.core.cache import cache
from user_management.utils import (get_user_ids, get_followers_ids,
                                   get_home_timeline, get_user_timeline
                                   )


class Cache:

    def __new__(cls):
        if hasattr(cls, 'instance'):
            return cls.instance

        cls.instance = super().__new__(cls)
        return cls.instance

    def __init__(self):
        self.load_users_data()

    def load_user_data(self, user):

        follower_ids = get_followers_ids(user.id)
        home_timeline = get_home_timeline(user.id)
        user_timeline = get_user_timeline(user.id)
        self.set_cache(user.id, "follower_ids", follower_ids)
        self.set_cache(user.id, "home_timeline", home_timeline)
        self.set_cache(user.id, "user_timeline", user_timeline)

    def load_users_data(self):

        user_ids = get_user_ids()
        for user_id in user_ids:
            follower_ids = get_followers_ids(user_id)
            home_timeline = get_home_timeline(user_id)
            user_timeline = get_user_timeline(user_id)
            self.set_cache(user_id, "follower_ids", follower_ids)
            self.set_cache(user_id, "home_timeline", home_timeline)
            self.set_cache(user_id, "user_timeline", user_timeline)

    def set_cache(self, user_id, type, data):
        if cache.get(user_id):
            obj = cache.get(user_id)
            obj[type] = data
            cache.set(user_id, obj)
            return
        obj = {type:data}
        cache.set(user_id, obj)

    def get_cache(self, user_id, type):

        if not cache.get(user_id):
            return None

        obj = cache.get(user_id)
        if type in obj:
            return obj[type]

    def clear_cache(self, user_id):

        cache.delete(user_id)

