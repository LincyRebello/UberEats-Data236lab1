from django.urls import re_path
from .consumers import KafkaConsumerWebSocket

websocket_urlpatterns = [
    re_path(r'ws/updates/(?P<token>.+)/$', KafkaConsumerWebSocket.as_asgi()),
]