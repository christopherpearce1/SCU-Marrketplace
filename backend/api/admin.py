from django.contrib import admin
from .models import Listing, UserProfile

# Register your models here.
admin.site.register(Listing)
admin.site.register(UserProfile)
