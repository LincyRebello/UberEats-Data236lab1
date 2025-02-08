# Create your views here.
# orders/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Order, Cart, CartItem, Customer, Restaurant, Dish
from .serializers import *
from .utils import getRandomOrderId
import logging
from django.db import transaction
from .kafka_producer import send_order_message
from bson.decimal128 import Decimal128
from django.conf import settings

# Get an instance of a logger
logger = logging.getLogger(__name__)


class OrderCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        try:
            customer = Customer.objects.get(user=request.user)
            cart = Cart.objects.filter(customer=customer).first()
            if cart:
                cartItems = CartItem.objects.filter(cart=cart)
                if len(cartItems)>0:
                    restaurant = cartItems[0].dish.restaurant
                    serializer = OrderCreateSerializer(data=request.data)
                    if serializer.is_valid():
                        order_id = getRandomOrderId()
                        order = Order(
                            order_id = order_id,
                            customer = customer,
                            restaurant = restaurant,
                            delivery_address = serializer.data.get("delivery_address"),
                            is_pick = serializer.data.get("is_pick",False)
                        )
                        order.save()
                        total_price = 0
                        for cartItem in cartItems:
                            cartTotalPrice = 0
                            if type(cartItem.dish.price) is Decimal128:  
                                 cartTotalPrice = cartItem.dish.price.to_decimal()*cartItem.quantity
                            else:
                                cartTotalPrice=cartItem.dish.price*cartItem.quantity
                            print(cartTotalPrice, total_price)
                            total_price+=cartTotalPrice

                            orderItem = OrderItem(
                                order = order,
                                dish = cartItem.dish,
                                quantity = cartItem.quantity,
                                total_price = cartTotalPrice
                            )
                            orderItem.save()
                            cartItem.delete()
                        order.total_price = total_price + decimal.Decimal(2.99) if total_price>0 else decimal.Decimal(0)
                        order.save()
                        
                        serializer = GetOrderSerializer(order)

                        messageData = {
                            "message_type":'create_order',
                            "order_data":serializer.data
                        }

                        # Send the order data to Kafka topic "orders"
                        send_order_message(settings.KAFKA_TOPIC, messageData, group_ids=[str(order.restaurant.user.id)])

                        return Response(serializer.data, status=status.HTTP_201_CREATED)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        except Customer.DoesNotExist:
                logger.debug(f"Customer not found")
                return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
        
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def CustomerGetOrderListView(request):
    try:
        customer = Customer.objects.get(user=request.user)
        orders = Order.objects.filter(customer=customer)
        serializer = GetOrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Customer.DoesNotExist:
            logger.debug(f"Customer not found")
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def CustomerCancelOrderView(request, order_id):
    try:
        customer = Customer.objects.get(user=request.user)
        order = Order.objects.filter(order_id=order_id).first()
        if customer.id == order.customer.id:
            if order.status=="Cancelled" or order.status=="Cancelled":
                return Response({'error': 'Order is already Cancelled or Delivered'}, status=status.HTTP_406_NOT_ACCEPTABLE)
            # order.status = "Cancelled"
            # order.save()
            data = {
                    "status":"Cancelled",
                    "total_price":str(order.total_price)
            }
            orderSer = OrderSerializer(order, data=data,partial=True)
            orderSer.is_valid(raise_exception=True)
            orderSer.save()
            orders = Order.objects.filter(customer=customer)
            serializer = GetOrderSerializer(orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Access not allowed to cancel this Order'}, status=status.HTTP_401_UNAUTHORIZED)
    except Customer.DoesNotExist:
            logger.debug(f"Customer not found")
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def RestaurantChangeOrderStatusView(request, order_id):
    try:
        restaurant = Restaurant.objects.get(user=request.user)
        order = Order.objects.filter(order_id=order_id).first()
        order_status = request.data.get("status","")
        if restaurant.id == order.restaurant.id:
            if order.status=="Cancelled":
                return Response({'error': 'Order is already Cancelled or Delivered'}, status=status.HTTP_406_NOT_ACCEPTABLE)
            if order_status in ["Preparing","On the Way","Delivered","Ready to pick","Cancelled"]:
                data = {
                     "status":order_status,
                     "total_price":str(order.total_price)
                }
                orderSer = OrderSerializer(order, data=data,partial=True)
                orderSer.is_valid(raise_exception=True)
                orderSer.save()
                orders = Order.objects.filter(restaurant=restaurant)
                serializer = GetOrderSerializer(orders, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Access not allowed to change status of this Order'}, status=status.HTTP_401_UNAUTHORIZED)
    except Restaurant.DoesNotExist:
            logger.debug(f"Restaurant not found")
            return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def RestaurantGetOrderListView(request):
    try:
        restaurant = Restaurant.objects.get(user=request.user)
        orders = Order.objects.filter(restaurant=restaurant)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Restaurant.DoesNotExist:
            logger.debug(f"Restaurant not found")
            return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)

# orders/views.py
class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        restaurant_id = self.kwargs['restaurant_id']
        return Order.objects.filter(restaurant__id=restaurant_id)
    
class OrderUpdateView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class CartItemsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            customer = Customer.objects.get(user=request.user)
            cart = Cart.objects.filter(customer=customer).first()
            if cart is None:
                cart = Cart(customer=customer)
                cart.save()
            cartItems = CartItem.objects.filter(cart=cart)
            serializer = CartItemsSerializer(cartItems, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Customer.DoesNotExist:
                logger.debug(f"Customer not found")
                return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def post(self, request):
        try:
            customer = Customer.objects.get(user=request.user)
            cart = Cart.objects.filter(customer=customer).first()
            if cart is None:
                cart = Cart(customer=customer)
                cart.save()
            serializer = CartItemsCreateSerializer(data=request.data)
            if serializer.is_valid():
                data = serializer.data
                quantity = data.get('quantity')
                dish = Dish.objects.get(id=data.get("dish_id"))
                if quantity>0:
                    cartItems = CartItem.objects.filter(cart=cart)
                    for existingCartItem in cartItems:
                        if existingCartItem.dish.restaurant.id!=dish.restaurant.id:
                            existingCartItem.delete()
                cartItem = CartItem.objects.filter(cart=cart, dish=dish).first()
                if quantity>0:
                    if cartItem:
                        cartItem.quantity = quantity
                    else:
                        cartItem = CartItem(cart=cart,dish=dish, quantity=quantity)
                    cartItem.save()
                elif cartItem:
                    cartItem.delete()
                
                cartItems = CartItem.objects.filter(cart=cart)
                serializer = CartItemsSerializer(cartItems, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Customer.DoesNotExist:
                logger.debug(f"Customer not found")
                return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
        except Dish.DoesNotExist:
                logger.debug(f"Dish not found")
                return Response({'error': 'Dish not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@permission_classes([AllowAny])
def sendKafkaMsg(request):
    print("send kafka message")
    order_data = {
        'order_id': 1,
        'item': 'Pizza',
        'quantity': 2
    }

    messageData = {
        "message_type":'create_order',
        "order_data":order_data
    }

    # Send the order data to Kafka topic "orders"
    send_order_message('orders', messageData)
    return Response({'msg': 'send kafka message'}, status=status.HTTP_200_OK)