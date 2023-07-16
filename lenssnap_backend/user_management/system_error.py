from lenssnap_backend import error_conf


def check_follower_error(data):

    if data.get('followed_by') == data.get('followed_to'):
        return error_conf.USER_FOLLOWED_ERROR
