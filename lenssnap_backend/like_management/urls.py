from django.urls import include, path

from rest_framework.routers import DefaultRouter
from like_management import views

router = DefaultRouter()
router.register(r'likes', views.LikeList, basename='like')

urlpatterns = [
    path('', include(router.urls))
]
