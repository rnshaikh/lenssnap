from lenssnap_backend import error_conf


def check_pin_update_error(data, pin):

    if pin.created_by.id != data['updated_by']:
        return error_conf.PIN_CANT_UPDATE

