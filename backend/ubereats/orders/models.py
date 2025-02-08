# Create your models here.
# orders/models.py
from django.db import models
from customers.models import Customer
from restaurants.models import Restaurant, Dish

class Cart(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True)  # Link to User model
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("cart", "dish")


class Order(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Preparing', 'Preparing'),
        ('Ready to pick', 'Ready to pick'),
        ('On the Way', 'On the Way'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    order_id = models.CharField(max_length=255,null=True, blank=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New')
    created_at = models.DateTimeField(auto_now_add=True)
    delivery_address = models.CharField(max_length=255)
    is_pick = models.BooleanField(default=False, null=True)
    total_price = models.DecimalField(max_digits=6, decimal_places=2, null=True)

    def __str__(self):
        return f"Order {self.order_id} - {self.status}"

# orders/models.py
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=6, decimal_places=2, null=True)

    def __str__(self):
        return f"{self.quantity} x {self.dish.name}"
