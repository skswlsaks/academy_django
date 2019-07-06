from django.conf.urls import url
from channels.routing import ProtocolTypeRouter, URLRouter

from . import consumers

websocket_urlpatterns = [
    url('ws/signaling/<str:room_name>/', consumers.SignalConsumer),
]