# lenssnap

Image Sharing App

Lenssnap is image sharing app where you connect with people and share your pics and life experience with
them

Stack: Django-Rest-Framework, LocalMemoryCache, drf_social_oauth2, React.js, google OAuth2, tailwind css.


# Feature:

1. Google Login
1. Pin Crud Feature
1. Comment & Reply CRUD Feature
1. Like/Unlike for Pin/Comment/Reply Feature
1. Discover Friend Follow/UnFollow User's.
1. User HomeTimeline.
1. User Timeline


# Backend

Installation:

python >= 3.8

create google oauth2
create virtual env then follow following steps.

***Backend env variable***

    `
        SECRET_KEY - secret key
        DEBUG - boolean
        ALLOWED_HOSTS - list of ip/ "*"
        ENVIRONMENT - dev/qa/prod
        DB_ENGINE - django db engine
        DB_DATABASE - database name
        DB_HOST - db host
        DB_USER - db user
        DB_PASSWORD - db password
        DB_PORT - db Port
        CORS_ALLOW_ALL_ORIGINS - True/False
        CORS_ALLOWED_ORIGINS - list of ip/"*"
        INFO_LOGFILE_LOCATION - info log file location
        DEBUG_LOGFILE_LOCATION - debug log file location
        GOOGLE_CLIENT_ID - google auth2 app client id
        GOOGLE_CLIENT_SECRET - google auth2 app client secret

    `
add above env in .env file in backend root directory.

    `
        pip install -r requirements.txt
        python manage.py makemigrations
        python manage.py runserver

        create django-oauth2 app with resource owner password based auth.
        store client id and client-secret

    `
# Frontend

Installation

node >= v16.14.2


***frontend env variable***

    `
        PORT - port number
        REACT_APP_GOOGLE_CLIENT_ID - google oauth2 app client id
        REACT_APP_BACKEND_CLIENT_ID - django oauth2 app client id
        REACT_APP_BACKEND_CLIENT_SECRET - django oauth2 app client secret
        REACT_APP_BACKEND_URL - backend url
        REACT_APP_SUPPORTED_FILES - list of supported mime type for pin
    `

add above env in .env file in frontend root directory.


    `
        npm install
        npm run start

    `

# Images Of Features:

    1. HomePage

    ![Screenshot of HomePage.](./images/HomePage.png)
