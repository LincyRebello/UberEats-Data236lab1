from django.core.management.base import BaseCommand
from restaurants.models import Restaurant, Dish

class Command(BaseCommand):
    help = 'Loads dummy data into the database'

    def handle(self, *args, **kwargs):
        # Delete existing restaurants if needed to avoid duplicates
        Restaurant.objects.all().delete()

        # Create some dummy restaurants with unique emails
        restaurant1 = Restaurant.objects.create(
            name='Annapoorna', email='anna1@example.com', location='123 Main St', 
            description='Famous South Indian food', contact_info='(555) 123-4567', 
            timings='9 AM - 10 PM'
        )
        restaurant2 = Restaurant.objects.create(
            name='Gokul Chaat', email='gokul2@example.com', location='456 Oak St', 
            description='Spicy Indian Chaats', contact_info='(555) 987-6543', 
            timings='10 AM - 8 PM'
        )
        restaurant3 = Restaurant.objects.create(
            name='Poke House', email='poke3@example.com', location='789 Pine St', 
            description='Fresh Hawaiian poke bowls', contact_info='(555) 246-1357', 
            timings='11 AM - 9 PM'
        )

        # Create some dummy dishes for the restaurants
        Dish.objects.create(
            restaurant=restaurant1, name='Dosa', ingredients='Rice, Dal, Potatoes', 
            price=5.99, category='Main Course'
        )
        Dish.objects.create(
            restaurant=restaurant1, name='Idli', ingredients='Rice, Dal', 
            price=3.99, category='Appetizer'
        )
        Dish.objects.create(
            restaurant=restaurant2, name='Pani Puri', ingredients='Wheat, Chickpeas', 
            price=4.99, category='Appetizer'
        )
        Dish.objects.create(
            restaurant=restaurant2, name='Samosa', ingredients='Potatoes, Peas', 
            price=2.99, category='Appetizer'
        )
        Dish.objects.create(
            restaurant=restaurant3, name='Spicy Tuna Poke', ingredients='Tuna, Rice, Avocado', 
            price=10.99, category='Main Course'
        )
        Dish.objects.create(
            restaurant=restaurant3, name='Shoyu Poke', ingredients='Salmon, Rice, Soy Sauce', 
            price=9.99, category='Main Course'
        )

        self.stdout.write(self.style.SUCCESS('Dummy restaurants and dishes added successfully!'))
