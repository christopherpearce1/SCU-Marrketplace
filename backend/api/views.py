from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import Listing
from .serializers import ListingSerializer, UserSerializer

# User views
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return Response({
                'id': user.id,
                'username': user.username,
                'message': 'Login successful'
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out'})

class CurrentUserView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            phone = ''
            address = ''
            if hasattr(request.user, 'profile'):
                phone = request.user.profile.phone
                address = request.user.profile.address
            return Response({
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'phone': phone,
                'address': address,
            })
        return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)



# Listing views
class ListingListCreate(generics.ListCreateAPIView):
    serializer_class = ListingSerializer
    permission_classes = [AllowAny]

    def get_queryset(self): #all listings show
        return Listing.objects.all()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated: # only auth users can create
            serializer.save(author=self.request.user)
        else:
            serializer.save(author=None)

class ListingDetailView(generics.RetrieveAPIView):
    serializer_class = ListingSerializer
    permission_classes = [AllowAny]  #qnyone can view
    queryset = Listing.objects.all()

class ListingDelete(generics.DestroyAPIView):
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): # can only delete own listing
        return Listing.objects.filter(author=self.request.user)
    




