from django.urls import path
from . import views

urlpatterns = [
    path('listings/', views.ListingListCreate.as_view()),  # get - show all, post - create
    path('listings/<int:pk>/', views.ListingDetailView.as_view()),
    path('listings/<int:pk>/delete/', views.ListingDelete.as_view()),
]
