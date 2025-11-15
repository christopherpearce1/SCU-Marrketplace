from django.urls import path
from .views import itemList

urlpatterns = [
    path("", itemList.as_view(), name="home"),
]