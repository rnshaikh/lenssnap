from django.urls import include, path

from rest_framework.routers import DefaultRouter

from pin_management import views

router = DefaultRouter()
router.register(r'pins', views.PinList, basename='pin')

urlpatterns = [
    path('', include(router.urls))
]
