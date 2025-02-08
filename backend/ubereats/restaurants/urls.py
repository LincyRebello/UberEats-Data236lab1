from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterRestaurantView.as_view(), name='register_restaurant'),
    path('login/', LoginRestaurantView.as_view(), name='login_restaurant'),
    #removing this double restaurants
    path('<int:restaurant_id>/profile/', RestaurantProfileView.as_view(), name='restaurant_profile'),  # Updated with restaurant_id
    path('<int:restaurant_id>/dishes/', DishListCreateView.as_view(), name='dish_list_create'),
    path('dishes/<int:dish_id>/', DishRetrieveUpdateDestroyView.as_view(), name='dish_detail'),
    path('', RestaurantListView.as_view(), name='restaurant_list'),
    path('<int:pk>/', RestaurantDetailView.as_view(), name='restaurant_detail'),

    #extra apis
    path('profile/', getRestaurantProfileView, name='restaurant_profile_view'),
    path('dishes/', getDishesView, name='dishes_view'),
]
