from channels.generic.websocket import AsyncWebsocketConsumer
from channels.auth import login
from channels.db import database_sync_to_async
from .models import Peer_Connection
# from channels.consumer import AsyncConsumer
import json


class SignalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        self.user = self.scope['user']

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # if self.scope['user'].is_anonymous:
        #     await self.close()
        # else:
        #     await self.accept()

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    @database_sync_to_async
    def get_filter_users(self):
        return Peer_Connection.objects.filter(chat_room=self.room_name) 

    # Receive message from WebSocket
    async def receive(self, text_data):
        await login(self.scope, self.user)

        text_data_json = json.loads(text_data)
        res_data = text_data_json['peer']
        new_Peer = Peer_Connection(username=self.user, 
                                   peer_connection=res_data,
                                   chat_room=self.room_name)
        await database_sync_to_async(new_Peer.save)()

        all_peers = await self.get_filter_users()
        send_back_peers = []
        for pp in all_peers:
            send_back_peers.append(pp.peer_connection)
        full_context = {
            'type': 'peer',
            'peers': send_back_peers
        }

        print(full_context)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            full_context
        )

    # Receive message from room group
    async def holy(self, event):
        message = event['message']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def info(self, event):
        message = event['message']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def peer(self, event):
        message = event['peers']
        await self.send(text_data=json.dumps({
            'peers': message
        }))

    async def offer(self, event):
        await self.send(text_data=json.dumps({
            'message': event
        }))

    async def candidate(self, event):
        await self.send(text_data=json.dumps({
            'message': event
        }))

    async def answer(self, event):
        await self.send(text_data=json.dumps({
            'message': event
        }))

