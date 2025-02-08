from rest_framework import serializers
from restaurants.serializers import RestaurantSerializer
from customers.serializers import CustomerSerializer
from .models import Favorites

class FavoritesSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer(read_only=True)
    class Meta:
        model = Favorites
        fields = ['id', 'restaurant', 'created'] 
