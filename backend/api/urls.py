from django.urls import path
from . import views

urlpatterns = [
    # User authentication endpoints
    path('user/register/', views.CreateUserView.as_view()),
    path('user/login/', views.LoginView.as_view()),
    path('user/logout/', views.LogoutView.as_view()),
    path('user/me/', views.CurrentUserView.as_view()),
    
    # Listing endpoints
    path('listings/', views.ListingListCreate.as_view()),  # get - show all, post - create
    path('listings/<int:pk>/', views.ListingDetailView.as_view()),
    path('listings/<int:pk>/delete/', views.ListingDelete.as_view()),
]
