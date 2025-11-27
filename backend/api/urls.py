from django.urls import path
from . import views

urlpatterns = [
    path('listings/', views.ListingListCreate.as_view()),
    path('home/<int:pk>/delete/', views.ListingDelete.as_view()),

]
