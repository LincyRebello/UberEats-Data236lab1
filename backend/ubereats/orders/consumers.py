from channels.generic.websocket import AsyncWebsocketConsumer
import json
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.contrib.auth.models import User

def getUserByToken(token):
    try:
        access_token = AccessToken(token=token, verify=True)
        print(access_token["user_id"])
        user = User.objects.filter(id=access_token["user_id"]).first()
        return user
    except Exception as e:
        print(e)
    return None

class KafkaConsumerWebSocket(AsyncWebsocketConsumer):
    async def connect(self):
        token = self.scope['url_route']['kwargs']["token"]
        user = getUserByToken(token)
        if user:
            # print(user.id)
            self.room_group_name = str(user.id)

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()
        else:
            await self.close()


    async def disconnect(self, close_code):
        # Leave room group
        if self.room_group_name and self.channel_name:
            await self.channel_layer.group_discard(
                self.room_group_name, self.channel_name
            )


    async def receive(self, text_data):
        # Handle messages received from WebSocket client (if needed)
        pass


    async def send_kafka_message(self, event):
        # Send the Kafka message to the WebSocket client
        message = event['message']
        await self.send(text_data=json.dumps({'message': message}))
