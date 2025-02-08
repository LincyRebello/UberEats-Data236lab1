# orders/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem, CartItem
from restaurants.serializers import DishSerializer, GetRestaurantSerializer, RestaurantSerializer
from customers.serializers import CustomerSerializer
from bson.decimal128 import Decimal128, decimal

class OrderItemSerializer(serializers.ModelSerializer):
    dish = DishSerializer(read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id','dish', 'quantity', 'total_price']
    
class GetOrderItemSerializer(serializers.ModelSerializer):
    dish = DishSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    class Meta:
        model = OrderItem
        fields = ['id','dish', 'quantity', 'total_price']
    
    def get_total_price(self, order:OrderItem):
        if type(order.total_price) is Decimal128:
            return float(order.total_price.to_decimal())
        elif type(order.total_price) is decimal.Decimal:
            return float(order.total_price)
        return order.total_price

# orders/serializers.py
class GetOrderSerializer(serializers.ModelSerializer):
    order_items = GetOrderItemSerializer(many=True)
    customer = CustomerSerializer()
    restaurant = GetRestaurantSerializer()
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id','customer', 'restaurant', 'status', 'delivery_address', 'order_items', "order_id", "total_price","is_pick"]
    
    def get_total_price(self, order:Order):
        if type(order.total_price) is Decimal128:
            return float(order.total_price.to_decimal())
        elif type(order.total_price) is decimal.Decimal:
            return float(order.total_price)
        return order.total_price

# orders/serializers.py
class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True)
    customer = CustomerSerializer()
    restaurant = RestaurantSerializer()
    
    class Meta:
        model = Order
        fields = ['id','customer', 'restaurant', 'status', 'delivery_address', 'order_items', "order_id", "total_price","is_pick"]
    
    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')
        order = Order.objects.create(**validated_data)
        for item_data in order_items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order
    
class CartItemsSerializer(serializers.ModelSerializer):
    dish = DishSerializer(read_only=True)
    class Meta:
        model = CartItem
        fields = ['dish','quantity']

class CartItemsCreateSerializer(serializers.Serializer):
    dish_id = serializers.IntegerField()
    quantity = serializers.IntegerField()

class OrderCreateSerializer(serializers.Serializer):
    delivery_address = serializers.CharField()
    is_pick = serializers.BooleanField(default=False)
