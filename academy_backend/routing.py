from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import signaling.routing

ASGI_APPLICATION = "academy_backend.routing.application"

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            signaling.routing.websocket_urlpatterns
        )
    ),
})