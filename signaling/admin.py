from django.contrib import admin
from .models import Peer_connection, Peer_connection_Admin

# Register your models here.
admin.site.register(Peer_connection, Peer_connection_Admin)