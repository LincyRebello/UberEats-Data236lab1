from django.urls import path
from .views import *

urlpatterns = [
    path('create/', OrderCreateView.as_view(), name='create_order'),
    path('customer-orders/', CustomerGetOrderListView, name='customer_orders_list'),
    path('customer-orders/<str:order_id>/cancel-order/', CustomerCancelOrderView, name='customer_cancel_order'),
    path('restaurant-orders/', RestaurantGetOrderListView, name='restaurant_orders_list'),
    path('restaurant-orders/<str:order_id>/change-status/', RestaurantChangeOrderStatusView, name='restaurant_change_order_status'),
    path('restaurant/<int:restaurant_id>/', OrderListView.as_view(), name='order_list'),
    path('<int:pk>/update/', OrderUpdateView.as_view(), name='update_order'),
    path('cart-items/',CartItemsView.as_view(), name="cart-items"),
    path('send-kafka-msg/',sendKafkaMsg, name="send-kafka-msg")
]