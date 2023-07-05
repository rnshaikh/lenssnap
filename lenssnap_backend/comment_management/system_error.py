
from pin_management.models import Pin
from lenssnap_backend import error_conf


def comment_creation_error_check(data):

    if not data.get('content_type'):
        return error_conf.CONTENT_TYPE_REQUIRED

    if not data.get('content_object'):
        return error_conf.CONTENT_OBJ_REQUIRED

    try:
        pin = data.get('content_type').objects.get(id=data.get('content_object'))
        data['content_object'] = pin
    except:
        return error_conf.NOT_FOUND


def comment_updation_error_check(request, comment):

    if comment.created_by != request.user:
        return error_conf.CANT_UPDATE
