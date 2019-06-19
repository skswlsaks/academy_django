from channels.generic.websocket import AsyncWebsocketConsumer
from channels.auth import login
from channels.db import database_sync_to_async
from .models import Peer_connection
# from channels.consumer import AsyncConsumer
import json
import ast 


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
        return Peer_connection.objects.filter(chat_room=self.room_name) 
    
    @database_sync_to_async
    def update_user(self, new_peer):
        data = Peer_connection.objects.get(username=self.user)
        data.peer_id = new_peer['_id']
        data.peer_connection = new_peer
        data.chat_room = self.room_name
        data.save()

    # Receive message from WebSocket
    async def receive(self, text_data):
        await login(self.scope, self.user)

        text_data_json = json.loads(text_data)
        keys = text_data_json.keys()
        full_context = {}

        if 'peer' in keys:
            res_data = text_data_json['peer']
            try:
                await self.update_user(res_data)
            except:
                new_Peer = Peer_connection(username=self.user, 
                                    peer_id=res_data['_id'],
                                    peer_connection=res_data,
                                    chat_room=self.room_name)
                await database_sync_to_async(new_Peer.save)()
            all_peers = await self.get_filter_users()
            send_back_peers = {}

            for pp in all_peers:
                send_back_peers[pp.username.username] = pp.peer_connection
            full_context = {
                'type': 'peer',
                'peers': send_back_peers
            }
        elif 'call' in keys:
            caller = text_data_json['call']
            called = text_data_json['becalled']
            try:
                caller = ast.literal_eval(caller)
            except:
                pass
            full_context = {
                'type': 'call',
                'peers': caller['_id'],
                'called': called['_id']
            }
        elif 'receive' in keys:
            print("Got receive")
            receive = text_data_json['receive']
            data = text_data_json['data']
            full_context = {
                'type': 'receive_call',
                'receiver': receive,
                'data': data
            }
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
            'type': 'peer',
            'peers': message
        }))

    async def call(self, event):
        message = event['peers']
        await self.send(text_data=json.dumps({
            'type': 'call',
            'peers': message,
            'called': event['called']
        }))
    async def receive_call(self, event):
        receiver = event['receiver']
        data = event['data']
        await self.send(text_data=json.dumps({
            'type': 'receive',
            'receiver': receiver,
            'data': data
        }))

