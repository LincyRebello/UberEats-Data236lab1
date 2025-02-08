from confluent_kafka import Producer
import json
from django.conf import settings

# Kafka configuration settings

KAFKA_CONFIG = {
    'bootstrap.servers': settings.KAFKA_BOKER,  # Kafka broker address
}
# Initialize the Kafka producer
producer = Producer(KAFKA_CONFIG)

def delivery_report(err, msg):
    """Callback function to report message delivery status."""
    if err is not None:
        print(f'Message delivery failed: {err}')
    else:
        print(f'Message delivered to {msg.topic()} [{msg.partition()}]')

def send_order_message(topic, data, group_ids=[]):
    """
    Function to send a message to Kafka topic.
    :param topic: Kafka topic to publish to
    :param data: Dictionary data to send
    """
    try:
        # Convert data to JSON
        produceData = {
            "group_ids":group_ids,
            "data":data
        }
        json_data = json.dumps(produceData)
        # Send message to Kafka topic
        producer.produce(topic, json_data, callback=delivery_report)
        producer.flush()  # Wait for all messages to be sent
        print(f"Message sent to topic '{topic}': {json_data}")
    except Exception as e:
        print(f"Error sending message to Kafka: {str(e)}")