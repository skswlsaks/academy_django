import React from 'react';
import '../style/MainView.css';
import PropTypes from 'prop-types';
import PeerCreation from '../Peers/peer';
import UserThumbNail from '../components/UserThumbNail';
import { update_peer } from '../actions/index';
import { connect } from 'react-redux';

class MainForm extends React.Component {

	constructor (props) {
		super(props);
		
		this.getScreenAction = this.getScreenAction.bind(this);
		this.connectToRoom = this.connectToRoom.bind(this);
	
		this.state = {
			localVideo: {},
			initiator: false,
			chatSocket: null
		};

	}

	peercreation = new PeerCreation();
	my_peer = {};

	componentDidMount() {
		// var room = prompt("Enter room name:");
		// var username = prompt("Enter username please: ");
		var username = "newbie";
		// console.log(this.state);
		// // Connecting to chatroom
		const newSocket = new WebSocket('ws://127.0.0.1:8000/ws/signaling/new/');
		newSocket.onopen = function(e) {}
	
		newSocket.onmessage = function(e) {
			var data = JSON.parse(e.data);
			var message = data['peers'];
			console.log("chatSocket from onmessage: ");
			console.log(message);
			update_peer(message);
		}

		newSocket.onclose = function(e) {
			console.error('Chat socket closed unexpectedly!');
		}

		this.getScreenAction(function(peer){
			
			var msg = JSON.stringify({
				'peer': peer,
				'username': username
			});
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
			<UserThumbNail username="Marry"></UserThumbNail>
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

const mapDispatchToProps = dispatch => ({
	update_peer: (peers) =>{
		dispatch (update_peer(peers));
	}
});

MainForm.propTypes = {
	getScreenAction: PropTypes.func
};

MainForm.defaultProps = {
	getScreenAction: () => console.warn("getScreenAction not defined!")
};

const ConnectedMainForm = connect(undefined, mapDispatchToProps)(MainForm);

export default ConnectedMainForm;