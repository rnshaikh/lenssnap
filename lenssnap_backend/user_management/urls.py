from django.urls import include, path

from rest_framework.routers import DefaultRouter

from user_management import views


router = DefaultRouter()
router.register(r'followers', views.FollowerList, basename='follower')

urlpatterns = [
    path('', include(router.urls))
]
