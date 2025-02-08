import random
from .models import Order

def getRandomOrderId():
    random_number1 = random.randint(1000, 9999)
    random_number2 = random.randint(1000, 9999)
    order_id = 'O{}{}'.format(random_number1, random_number2)
    order = Order.objects.filter(order_id=order_id).first()
    while order != None:
        random_number1 = random.randint(1000, 9999)
        random_number2 = random.randint(1000, 9999)
        order_id = 'O{}{}'.format(random_number1, random_number2)
        order = Order.objects.filter(order_id=order_id).first()
    return order_id

