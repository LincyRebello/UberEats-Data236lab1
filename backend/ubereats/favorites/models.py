from django.db import models
from django.contrib.auth.models import User
from customers.models import Customer
from restaurants.models import Restaurant

# Create your models here.

class Favorites(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True)  # Link to User model
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, null=True)  # Link to restaurant model
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.customer}==>{self.restaurant}'
