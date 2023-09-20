from django.urls import include, path
from rest_framework.routers import DefaultRouter

from comment_management import views
router = DefaultRouter()

router.register(r'comments', views.CommentViewset, basename='comment')

urlpatterns = [
    path('', include(router.urls))
]
