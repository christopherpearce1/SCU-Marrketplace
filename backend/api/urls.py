from django.urls import path
from . import views

urlpatterns = [
    path('listings/', views.ListingListCreate.as_view()),
    path('home/<int:pk>/', views.ListingDetailView.as_view()),
    path('home/<int:pk>/delete/', views.ListingDelete.as_view()),
    path('home/<int:pk>/update/', views.ListingUpdate.as_view()),
    path('home/<int:pk>/update/', views.ListingUpdate.as_view()),

]
