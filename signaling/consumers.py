from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.consumer import AsyncConsumer
import json

class SignalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
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

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        text_data_json = text_data_json['msg']
        
        if ('holy' in text_data_json.keys()):
            key = 'holy'
        elif ('info' in text_data_json.keys()):
            key = 'info'
        elif ('type' in text_data_json.keys()):
            key = 'type'
        
        message = text_data_json[key]
        
        full_context = {
            'type': key,
            'message': message
        }
        print (room_group_name)
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

    async def type(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def offer(self, event):
        print("hi, ", event)
        # message = event['message']
        await self.send(text_data=json.dumps({
            'message': event
        }))
    async def candidate(self, event):
        
        await self.send(text_data=json.dumps({
            'message': event
        }))