from django.urls import include, path

from rest_framework.routers import DefaultRouter

from user_management import views


router = DefaultRouter()
router.register(r'followers', views.FollowerList, basename='follower')
router.register(r'hometimelines', views.HomeTimeLineView, basename='hometimeline')
router.register(r'usertimelines', views.UserTimeLineView, basename='usertimeline')
router.register(r'users', views.UserProfileView, basename='users-detail')

urlpatterns = [
    path('', include(router.urls))
]
