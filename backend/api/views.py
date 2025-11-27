from django.shortcuts import render
from rest_framework import generics
from .models import Listing
from .serializers import ListingSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
import requests
from django.http import JsonResponse
from django.contrib.auth.models import User


# User views
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]



# Listing views
class ListingListCreate(generics.ListCreateAPIView):
    serializer_class = ListingSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return Listing.objects.all()
        return Listing.objects.filter(author=user)
        # return Listing.objects.filter(author=user)
            # queryset = super(ListingListCreate, self).get_queryset()
            # return queryset.filter(author=self.request.user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author = self.request.user)
        else:
            print(serializer.errors)

        return super().perform_create(serializer)
    
class ListingDelete(generics.DestroyAPIView):
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Listing.objects.filter(author=user)
    
class ListingDetailView(generics.RetrieveAPIView):
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Listing.objects.filter(author=user)
    




