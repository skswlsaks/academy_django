import React from 'react';
import '../style/MainView.css';
import PropTypes from 'prop-types';
import PeerCreation from '../Peers/peer';


class MainForm extends React.Component {

	constructor (props) {
		super(props);
		
		this.getScreenAction = this.getScreenAction.bind(this);
		this.connectToRoom = this.connectToRoom.bind(this);
		// this.getScreenStream = this.getScreenStream.bind(this);

		this.state = {
			localVideo: {},
			remoteVideo: null,
			initiator: false,
			peer: {},
			chatSocket: null
		};

	}

	peercreation = new PeerCreation();

	componentDidMount() {
		// var room = prompt("Enter room name:");
		// console.log(this.state);
		// // Connecting to chatroom
		const newSocket = new WebSocket('ws://127.0.0.1:8000/ws/signaling/new/');
		
		this.setState({
			...this.state,
			chatSocket: newSocket
		});
		// chatSocket.onopen = function(e) {}

		// chatSocket.onmessage = function(e) {
		// 	var data = JSON.parse(e.data);
		// 	var message = data['message'];
		// 	console.log("chatSocket from onmessage: " + message);
		// }

		// chatSocket.onclose = function(e) {
		// 	console.error('Chat socket closed unexpectedly!');
		// }
	}

	handleData(e) {
		var data = JSON.parse(e.data);
		var message = data['message'];
		console.log('respond from onMessage: ', message);
	}

	handleCloseConnection(e) {
		console.error('Chat socket closed unexpectedly! -Jeff');
	}

	getScreenStream(callback) {
		if (navigator.getDisplayMedia) {
			navigator.getDisplayMedia({
				video: true
			}).then(screenStream => {
				callback(screenStream);
			});
		} else if (navigator.mediaDevices.getDisplayMedia) {
			navigator.mediaDevices.getDisplayMedia({
				video: true
			}).then(screenStream => {
				callback(screenStream);
			});
		}
	}

	getScreenAction() {
		// var localStream = navigator.mediaDevices.getDisplayMedia({
		// 	video: true
		// });
		// this.setState({localVideo: localStream});
		// this.getScreenStream(function(screenStream) {
		// 	console.log('Adding local stream.');
		// 	this.localVideo.srcObject = screenStream;
		// 	this.setState({localStream: screenStream});
		// })

		const op = {
			video: true
		};
		navigator.mediaDevices.getDisplayMedia(
			op
		).then(stream => {
			this.setState({localVideo: stream});
			this.localVideo.srcObject = stream;
		});
	}

	connectToRoom() {
		console.log(this.state);
		const peer = this.peercreation.init(this.state.localVideo, this.state.initiator);
		
		var msg = JSON.stringify({peer});
		console.log(msg);
		this.state.chatSocket.send(msg);

		// peer.on('signal', data => {
        //     const signal = {
        //         room: roomId,
        //         desc: data
        //     }
        //     this.state.socket.send('signal', signal)
        // })
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