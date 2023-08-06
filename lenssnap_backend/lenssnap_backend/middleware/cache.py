from django.core.cache import cache
from django.core.cache.backends import locmem

from lenssnap_backend.cache_utils import Cache


class CacheLoad:

    def __init__(self, get_response):

        self.get_response = get_response

    def __call__(self, request):
        if not locmem._caches['unique-snowflake']:
            obj = Cache()
            obj.load_users_data()

        response = self.get_response(request)
        return response
