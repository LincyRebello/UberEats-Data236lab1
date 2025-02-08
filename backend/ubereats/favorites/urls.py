##
from django.urls import path
from .views import *

urlpatterns = [
    path('', getAllFaorites, name='all favorites'),
    path('<int:restaurant_id>/', FavoritesAPIView.as_view(), name='add/remove favorites'),
]
