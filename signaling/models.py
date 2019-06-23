from django.contrib import admin 
from django.db import models
from django.contrib.auth.models import User

class Room(models.Model):
    # list_display = ['username', 'chat_room']
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    room_name = models.CharField(max_length=50)


class Room_admin(admin.ModelAdmin):
    model = Room
    list_display = ['user', 'room_name']


