import logging
import json
import socket
import time

from django.http import JsonResponse


logger = logging.getLogger('debug_logger')


class RequestResponseLogMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def process_exception(self, request, exception):
        try:
            raise exception
        except Exception as e:
            logger.exception("Unhandled Exception: " + str(e))
            return JsonResponse({"msg": str(e)}, status=500)

    def __call__(self, request):
        start_time = time.time()
        log_data = {
            "remote_address": request.META.get('REMOTE_ADDR', None),
            'remote_hostname': socket.gethostname(),
            "method": request.method,
            "path": request.get_full_path()
        }

        if 'api/' in str(request.get_full_path()):
            request_body = json.loads(request.body.decode('utf-8')) if request.body else {}
            log_data['request_body'] = request_body
        response = self.get_response(request)

        if response and response["content-type"] == "application/json":
            response_body = json.loads(response.content.decode("utf-8"))
            log_data['response_body'] = response_body

        log_data['run_time'] = time.time() - start_time
        logger.debug(msg="request,response log", extra=log_data)
        return response
