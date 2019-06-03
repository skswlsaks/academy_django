import React from 'react';
import '../style/MainView.css';
import PropTypes from 'prop-types';
import PeerCreation from '../Peers/peer';


class MainForm extends React.Component {

	constructor (props) {
		super(props);
		
		this.getScreenAction = this.getScreenAction.bind(this);
		this.connectToRoom = this.connectToRoom.bind(this);
	

		this.state = {
			localVideo: {},
			remoteVideo: null,
			initiator: false,
			my_peer: {},
			peer: {},
			chatSocket: null
		};

	}

	peercreation = new PeerCreation();
	my_peer = {};

	componentDidMount() {
		// var room = prompt("Enter room name:");
		// console.log(this.state);
		// // Connecting to chatroom
		const newSocket = new WebSocket('ws://127.0.0.1:8000/ws/signaling/new/');
		newSocket.onopen = function(e) {}
	
		newSocket.onmessage = function(e) {
			var data = JSON.parse(e.data);
			var message = data['peers'];
			console.log(message);
			console.log("chatSocket from onmessage: " + String(message));
		}

		newSocket.onclose = function(e) {
			console.error('Chat socket closed unexpectedly!');
		}

		this.getScreenAction(function(peer){
			
			var msg = JSON.stringify({peer});
			console.log(msg);
			newSocket.send(msg);
		});

		this.setState({
			...this.state,
			chatSocket: newSocket
		})
		
	}

	handleData(e) {
		var data = JSON.parse(e.data);
		var message = data['message'];
		console.log('respond from onMessage: ', message);
	}

	handleCloseConnection(e) {
		console.error('Chat socket closed unexpectedly! -Jeff');
	}

	getScreenAction(callback) {
		navigator.mediaDevices.getDisplayMedia({
			video: true
		}).then(stream => {
			this.localVideo.srcObject = stream;
			var cur_peer = this.peercreation.init(stream, this.state.initiator);
			this.setState({
				localVideo: stream,
				my_peer: cur_peer
			});
			callback(cur_peer);
		});
	}

	connectToRoom() {
		// const peer = this.peercreation.init(this.state.localVideo, this.state.initiator);
		
		// var msg = JSON.stringify({peer});
		// console.log(msg);
		// this.state.chatSocket.send(msg);
		// var roomId = 'new';
		// this.peer.on('signal', data => {
        //     const signal = {
        //         room: roomId,
        //         desc: data
        //     }
        //     this.state.chatSocket.send({signal});
		// })
		
		console.log(this.state);
        // peer.on('stream', stream => {
        //     this.remoteVideo.srcObject = stream
        // })
        // peer.on('error', function (err) { 
        //     console.log(err)
        // })
	}

	render () {
		return (
			<div>
			<h1>Realtime communication with WebRTC</h1>
			<div className="video-wrapper" id="videos">
				<video id="localVideo" autoPlay playsInline ref={video => (this.localVideo = video)} />
				
				<video id="remoteVideo" autoPlay playsInline />
				<audio id="audio" autoPlay />
			</div>

			<div>
				<button id="send" onClick={this.connectToRoom}>Send</button>
				<button id="get_screen" onClick={this.getScreenAction}>Get screen</button>
				<button id="call">Call</button>
				<button id="sendData">Data send</button>
			</div>
			</div>
		);
	}
}

MainForm.propTypes = {
	getScreenAction: PropTypes.func
};

MainForm.defaultProps = {
	getScreenAction: () => console.warn("getScreenAction not defined!")
};

export default MainForm;