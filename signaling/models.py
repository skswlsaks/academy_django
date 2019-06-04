from django.db import models

# Create your models here.
class Peer_Connection(models.Model):
    username = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    peer_connection = models.TextField()
    chat_room = models.CharField(max_length=50)



