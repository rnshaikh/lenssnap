# import jwt

# import json
# import base64

# from rest_framework import authentication
# from users.models import User


# class GoogleAuthentication(authentication.BaseAuthentication):

#     def authenticate(self, request):
#         try:
#             auth_header = request.headers.get('Authorization', None)
#             if auth_header:
#                 token = auth_header.split("Bearer ")
#                 if len(token) >= 2:
#                     token = token[1]
#                     tok = token.split(".")[1]
#                     if tok[-1] != "=":
#                         tok = tok+"==="
#                     user_info = json.loads( base64.b64decode(tok))
#                     user, created = User.objects.get_or_create(
#                                                       id = user_info['sub'],
#                                                       email=user_info['email'],
#                                                       defaults={
#                                                         "image":user_info['picture'],
#                                                         "first_name": user_info['given_name'],
#                                                         "last_name": user_info['family_name']
#                                                         })
#                     print("user", user.id)
#                     return (user, None)

#                 return None
#             return None
#         except Exception:
#             return None
