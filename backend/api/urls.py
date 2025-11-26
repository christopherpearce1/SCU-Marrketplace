from django.urls import path
from .views import listingview

urlpatterns = [
    path('home/', listingview.as_view()),

]
