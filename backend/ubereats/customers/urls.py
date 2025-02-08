##
from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterCustomerView.as_view(), name='register_customer'),
    path('login/', LoginCustomerView.as_view(), name='login_customer'), 
    path('profile/', CustomerOwnProfileView.as_view(), name='customer_own_profile'),
    path('profile/<int:pk>/', CustomerProfileView.as_view(), name='customer_profile'), # Implement login similarly
]
