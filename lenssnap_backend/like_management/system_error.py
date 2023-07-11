
from lenssnap_backend import error_conf


def check_like_creation_error(data):

    if not data.get('content_type', None):
        return error_conf.CONTENT_TYPE_REQUIRED

    if not data.get('content_object', None):
        return error_conf.CONTENT_OBJ_REQUIRED
