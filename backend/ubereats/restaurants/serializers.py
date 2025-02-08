from rest_framework import serializers
from .models import Restaurant, Dish
from django.contrib.auth.hashers import check_password
from bson.decimal128 import Decimal128, decimal

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        # Ensure all relevant fields for the frontend are included
        fields = ['id', 'name', 'email', 'location', 'description', 'image', 'rating', 'timings'] 
        extra_kwargs = {'password': {'write_only': True}} 
    
    
    def validate(self, data):

        return super().validate(data)
    
class GetRestaurantSerializer(serializers.ModelSerializer):
    rating = serializers.SerializerMethodField()
    class Meta:
        model = Restaurant
        # Ensure all relevant fields for the frontend are included
        fields = ['id', 'name', 'email', 'location', 'description', 'image', 'rating', 'timings'] 
    
    def get_rating(self, restaurant:Restaurant):
        if type(restaurant.rating) is Decimal128:
            return float(restaurant.rating.to_decimal())
        elif type(restaurant.rating) is decimal.Decimal:
            return float(restaurant.rating)
        return restaurant.rating
    
    def validate(self, data):

        return super().validate(data)

class DishCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = '__all__'
    
class DishSerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField()
    class Meta:
        model = Dish
        fields = '__all__'
    
    def get_price(self,dish:Dish):
        if type(dish.price) is str:
            price = float(dish.price)
        elif type(dish.price) is Decimal128:
            price = float(dish.price.to_decimal())
        elif type(dish.price) is decimal.Decimal:
            price = float(dish.price.to_decimal())
        else:
            price = dish.price
        return price 

class RestaurantLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")

        try:
            restaurant = Restaurant.objects.get(email=email)
            data["restaurant"] = restaurant
        except Restaurant.DoesNotExist:
            raise serializers.ValidationError("Restaurant not found.")
        
        return data
