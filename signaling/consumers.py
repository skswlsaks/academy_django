from channels.generic.websocket import AsyncWebsocketConsumer
from knox.auth import TokenAuthentication
from channels.db import database_sync_to_async
from .models import Room
from rest_framework import HTTP_HEADER_ENCODING
import json

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
            await database_sync_to_async(Room.objects.get(user=self.user).delete())()
        except Exception:
            pass

        users_arr = await self.get_room_users_arr()
        full_context = {
            'type': 'user_disconnected',
            'username': self.user.username,
            'users_arr': users_arr
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

    async def get_room_users_arr(self):
        room_users = await database_sync_to_async(Room.objects.filter)(room_name=self.room_name)
        users_arr = {}
        for room_user in room_users:
            users_arr[room_user.user.username] = room_user.user.profile.isTeacher
        return users_arr

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
                    new_peer = Room(user=self.user, room_name=self.room_name)
                    await database_sync_to_async(new_peer.save)()
                    print("Server created new room_user object for: " + self.user.username)
                    users_arr = await self.get_room_users_arr()

                    full_context = {
                        'type': 'user_connected',
                        'username': self.user.username,
                        'users_arr': users_arr
                    }
                    # Send message to room group
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        full_context
                    )
                    return
                except Exception as e:
                    print(e)
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
            full_context = {
                'type': 'init_peer',
                'from_username': text_data_json['from_username'],
                'to_username': text_data_json['to_username']
            }

        elif 'offer' in keys:
            print("Server receive from websocket: offer")
            full_context = {
                'type': 'offer',
                'to_username': text_data_json['to_username'],
                'peer_data': text_data_json['offer']
            }

        elif 'notify' in keys:
            print("Server receive from websocket: notify")
            full_context = {
                'type': 'notify',
                'to_username': text_data_json['to_username'],
                'from_username': text_data_json['from_username']
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

    async def notify(self, event):
        await self.send(text_data=json.dumps({
            'type': 'notify',
            'to_username': event['to_username'],
            'from_username': event['from_username']
        }))

    async def user_connected(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_connected',
            'username': event['username'],
            'users_arr': event['users_arr']
        }))

    async def user_disconnected(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_disconnected',
            'username': event['username'],
            'users_arr': event['users_arr']
        }))