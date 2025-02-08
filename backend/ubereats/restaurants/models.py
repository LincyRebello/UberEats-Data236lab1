##iske niche wala code hai
from django.db import models

from django.contrib.auth.models import User

class Restaurant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Link to User model
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, default='default@example.com')
    #password = models.CharField(max_length=128, default='defaultpassword')
    location = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    contact_info = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='restaurant_images/', blank=True, null=True)
    timings = models.CharField(max_length=100, blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)

    def __str__(self):
        return self.name

    
class Dish(models.Model):
    CATEGORY_CHOICES = [
        ('Appetizer', 'Appetizer'),
        ('Salad', 'Salad'),
        ('Main Course', 'Main Course'),
        ('Dessert', 'Dessert'),
    ]

    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='dishes')
    name = models.CharField(max_length=100)
    ingredients = models.TextField(blank=True)
    image = models.ImageField(upload_to='dish_images/', blank=True, null=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    

    def __str__(self):
        return self.name


