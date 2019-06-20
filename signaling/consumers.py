from channels.generic.websocket import AsyncWebsocketConsumer
from knox.auth import TokenAuthentication
# from channels.auth import login
from channels.db import database_sync_to_async
from .models import Peer_connection
from rest_framework import HTTP_HEADER_ENCODING
# from channels.consumer import AsyncConsumer
import json
import ast

class SignalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        # NOTE: Group names may only contain letters, digits, hyphens, and periods. 
        # TODO: Implement sanitizer/filtering/validation for room_name
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Remove user from peer_connections if exists
        try:
            await database_sync_to_async(Peer_connection.objects.get(user=self.user).delete())()
        except Exception:
            pass

        all_peers = await self.get_filter_users()
        send_back_peers = {}
        for pp in all_peers:
            send_back_peers[pp.user.username] = pp.peer_connection
        full_context = {
            'type': 'user_disconnected',
            'username': self.user.username,
            'peers': send_back_peers
        }
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            full_context
        )

        # Remove user from room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    
    @database_sync_to_async
    def get_filter_users(self):
        return Peer_connection.objects.filter(chat_room=self.room_name) 

    @database_sync_to_async
    def update_user(self, new_peer):
        data = Peer_connection.objects.get(user=self.user)
        data.peer_id = new_peer['_id']
        data.peer_connection = new_peer
        data.chat_room = self.room_name
        data.save()

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        keys = text_data_json.keys()

        # Authenticate connection
        if 'access_token' in keys and text_data_json['access_token'] is not None:
            print('Server receive from websocket: access_token')
            try:
                knoxAuth = TokenAuthentication();
                user, auth_token = knoxAuth.authenticate_credentials(text_data_json['access_token'].encode(HTTP_HEADER_ENCODING))
                self.user = self.scope['user'] = user
            except Exception as e: #invalid tokens
                print(e)
                await self.close() #close connection

            return
        else:
            # check user is authenticated
            if hasattr(self, 'user') and hasattr(self.user, 'id') and not self.user.is_anonymous:
                pass
            else:
                await self.close() #close connection
                return

        # Signaling WebRTC peer connection
        full_context = {}
        if 'peer' in keys:
            print("Server receive from websocket: peer")
            peer_data = text_data_json['peer']
            try:
                await self.update_user(peer_data)
            except:
                new_peer = Peer_connection(user=self.user, 
                                    peer_id=peer_data['_id'],
                                    peer_connection=peer_data,
                                    chat_room=self.room_name)
                await database_sync_to_async(new_peer.save)()
                print("Server created new peer connection object: " + peer_data['_id'])
            all_peers = await self.get_filter_users()
            send_back_peers = {}

            for pp in all_peers:
                send_back_peers[pp.user.username] = pp.peer_connection
            full_context = {
                'type': 'peer',
                'peers': send_back_peers
            }
        elif 'call' in keys:
            print("Server receive from websocket: call")
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
        elif 'receive_call' in keys:
            print("Server receive from websocket: receive_call")
            receive = text_data_json['receive_call']
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
            'type': 'receive_call',
            'receiver': receiver,
            'data': data
        }))

    async def user_disconnected(self, event):
        username = event['username']
        peers = event['peers']
        await self.send(text_data=json.dumps({
            'type': 'user_disconnected',
            'username': username,
            'peers': peers
        }))