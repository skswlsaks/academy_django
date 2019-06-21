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
            send_back_peers[pp.user.username] = pp.peer
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
""" 
    @database_sync_to_async
    def update_peer(self, new_peer):
        data = Peer_connection.objects.get(user=self.user)
        data.peer = new_peer
        data.save() """

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

                #create peer_connection entry with empty peer
                try:
                    new_peer = Peer_connection(user=self.user, 
                                        chat_room=self.room_name,
                                        peer='')
                    await database_sync_to_async(new_peer.save)()
                    print("Server created new peer_connection object for: " + self.user.username)
                    
                    all_peers = await self.get_filter_users()
                    send_back_peers = {}

                    for pp in all_peers:
                        send_back_peers[pp.user.username] = 'not-initialized'
                    full_context = {
                        'type': 'user_connected',
                        'username': self.user.username,
                        'peers': send_back_peers
                    }
                    # Send message to room group
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        full_context
                    )
                    return
                except:
                    print('Something went wrong while creating peer_connection')
                    await self.close() #close connection
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

        full_context = {}
        if 'init_peer' in keys:
            print("Server receive from websocket: init_peer")
            from_username = text_data_json['from_username']
            to_username = text_data_json['to_username']
           
            full_context = {
                'type': 'init_peer',
                'from_username': from_username,
                'to_username': to_username
            }

        elif 'offer' in keys:
            print("Server receive from websocket: offer")
            peer_data = text_data_json['offer']
            to_username = text_data_json['to_username']
            full_context = {
                'type': 'offer',
                'to_username': to_username,
                'peer_data': peer_data
            }

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            full_context
        )

    async def init_peer(self, event):
        await self.send(text_data=json.dumps({
            'type': 'init_peer',
            'from_username': event['from_username'],
            'to_username': event['to_username']
        }))

    async def offer(self, event):
        await self.send(text_data=json.dumps({
            'type': 'offer',
            'to_username': event['to_username'],
            'peer_data': event['peer_data']
        }))

    async def user_connected(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_connected',
            'username': event['username'],
            'peers': event['peers']
        }))

    async def user_disconnected(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_disconnected',
            'username': event['username'],
            'peers': event['peers']
        }))