from django.contrib import admin 
from django.db import models
from django.contrib.auth.models import User

class Peer_connection(models.Model):
    # list_display = ['username', 'chat_room']
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    peer = models.TextField(blank=True, null=True) #THIS FIELD SEEMS REDUNDANT (CAN DELETE? discuss with jeff)
    chat_room = models.CharField(max_length=50)


class Peer_connection_admin(admin.ModelAdmin):
    model = Peer_connection
    list_display = ['user', 'chat_room', 'peer']


