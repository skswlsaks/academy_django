from django.conf.urls import url

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from . import consumers 

websocket_urlpatterns = [
	url(r'^ws/signaling/(?P<room_name>[^/]+)/$', consumers.SignalConsumer),
]

# application = ProtocolTypeRouter({

#     "websocket": AuthMiddlewareStack(
#         URLRouter([
#             url(r'^ws/signaling/(?P<room_name>[^/]+)/$', consumers.SignalConsumer),
#         ])
#     ),

# })