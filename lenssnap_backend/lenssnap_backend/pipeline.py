from social_core.backends.google import GoogleOAuth2


def get_avatar(backend, user, response, *args, **kwargs):

    if isinstance(backend, GoogleOAuth2):
        if response.get('picture'):
            user.picture = response['picture']
            user.save()
