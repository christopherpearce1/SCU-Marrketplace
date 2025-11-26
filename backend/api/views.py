from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from .models import Listing
from .serializers import ListingSerializer

# Create your views here.

class listingview(generics.ListAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
