import uuid 
from django.contrib import admin 
from django.db import models
from django.contrib.auth.models import User


class Peer_connection(models.Model):
    # list_display = ['username', 'chat_room']
    username = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    peer_id = models.TextField(max_length=20)
    peer_connection = models.TextField()
    chat_room = models.CharField(max_length=50)

class Peer_connection_Admin(admin.ModelAdmin):
    model = Peer_connection
    list_display = ['username', 'chat_room', 'peer_id']


