from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic.list import ListView
from .models import Item

# Create your views here.

class itemList(ListView):
    model = Item

