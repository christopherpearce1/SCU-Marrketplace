from rest_framework import serializers
from .models import Listing, UserProfile
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "password", "phone"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        phone = validated_data.pop('phone', '')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        # Create UserProfile for phone number and more stuff if needed
        UserProfile.objects.create(user=user, phone=phone)
        return user


class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ['id', 'title', 'description', 'price', 'created_at', 'sold', 'author']
        extra_kwargs = {"author": {"read_only": True}}