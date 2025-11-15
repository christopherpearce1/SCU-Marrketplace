from django.urls import path
from . import views

urlspatterns = [
    path('', views.item_list, name='item_list'),
    path('item/<int:pk>/', views.item_detail, name='item_detail'),
    path('item/create/', views.item_create, name='item_create'),
    path('login/', views.login_view, name='login')
    
]