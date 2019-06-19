// docker run -p 6379:6379 -d redis

import React from 'react';
import '../style/MainView.css';
import PropTypes from 'prop-types';
import PeerCreation from '../components/peer.js';
import UserThumbNail from '../components/UserThumbNail.js';
import * as actions from '../actions';
import { connect } from 'react-redux';


class MainForm extends React.Component {

	constructor (props) {
		super(props);
		
		this.getScreenAction = this.getScreenAction.bind(this);
		this.changeInit = this.changeInit.bind(this);
	}

	peercreation = new PeerCreation();


	async componentDidMount() {
		// var room = prompt("Enter room name:");
		// var username = prompt("Enter username please: ");
		// console.log(this.state);
		// // Connecting to chatroom
		const newSocket = new WebSocket('ws://localhost:8000/ws/signaling/new/');
		const that = this;
		newSocket.onopen = function(e) {}
	
		newSocket.onmessage = function(e) {
			var data = JSON.parse(e.data);
			console.log("chatSocket from onmessage: ");
			if (data.type == 'peer') {
				var message = data['peers'];
				that.props.update_peer(message);
			} else if (data.type == 'call') {
				var message = data['peers'];
				if (message == that.props.my_peer['_id']) {
					console.log("receiving call")
					that.connectToRoom(data['called']);
				}
			} else if (data.type == 'receive') {
				console.log("connected!")
				var message = data['receiver'];
				if (message == that.props.my_peer['_id']) {
					console.log("connected!")
					that.props.peercreation.connect(data['data'])
				}
			}
		}
		newSocket.onclose = function(e) {
			console.error('Chat socket closed unexpectedly!');
		}
		
		await this.getScreenAction()
		var msg = JSON.stringify({
			'peer': this.props.my_peer
		});
		newSocket.send(msg);

		this.props.update_socket(newSocket);
	}

	handleCloseConnection(e) {
		console.error('Chat socket closed unexpectedly! -Jeff');
	}

	async getSource(){
		if (navigator.getDisplayMedia) {
			return navigator.getDisplayMedia({video: true});
		} else if (navigator.mediaDevices.getDisplayMedia) {
			return navigator.mediaDevices.getDisplayMedia({video: true});
		}
	}

	async getScreenAction() {
		var stream = await this.getSource()
		this.localVideo.srcObject = await stream;
		const initiator = true;
		var cur_peer = this.peercreation.init(await stream, initiator);

		this.props.update_localstream(await stream);
		this.props.update_my_peer(await cur_peer, this.peercreation);
	}

	connectToRoom(receiver) {
		console.log('connecting to room');
		const my_peer = this.props.my_peer;

		my_peer.on('signal', (data) => {
			console.log('sending signal to remote peer!');
			var msg = JSON.stringify({
				'receive': receiver,
				'data': data
			});
			this.props.socket.send(msg);
		})
        // my_peer.on('stream', stream => {
        //     this.remoteVideo.srcObject = stream
        // })
        // my_peer.on('error', function (err) { 
        //     console.log(err)
        // })
	}

	changeInit() {
		this.props.my_peer.initiator = false;
		this.props.update_my_peer(this.props.my_peer);
		console.log(this.props.my_peer);
	}

	render () {

		const { all_peers } = this.props;
		console.log("from rendering!");
		console.log(this.props);

		return (
			<div>
			<h1>Realtime communication with WebRTC</h1>
			{
				Object.keys(all_peers).map((key, index) => {
					return (
						<UserThumbNail username={key} key={index} />
					);
				})
			}
			<div className="video-wrapper" id="videos">
				<video id="localVideo" autoPlay playsInline ref={video => (this.localVideo = video)} />
				<video id="remoteVideo" autoPlay playsInline ref={video => (this.remoteVideo = video)}/>
				<audio id="audio" autoPlay />
			</div>

			<div>
				<button id="send" onClick={this.changeInit} >Send</button>
				<button id="get_screen" onClick={this.getScreenAction}>Get screen</button>
				<button id="call" >Signal</button>
				<button id="sendData" >Data send</button>
			</div>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	update_peer: (peers) => {
		dispatch (actions.update_peer(peers));
	},
	update_my_peer: (my_peer, peercreation) => {
		dispatch (actions.update_my_peer(my_peer, peercreation));
	},
	update_localstream: (stream) => {
		dispatch (actions.update_localstream(stream));
	},
	update_socket: (socket) => {
		dispatch (actions.update_socket(socket));
	}
});

const mapStateToProps = (state) => {
	return {
		all_peers: state.peers,
		my_peer: state.my_peer,
		local_video: state.local_video,
		socket: state.socket
	};
};

MainForm.propTypes = {
	getScreenAction: PropTypes.func
};

MainForm.defaultProps = {
	getScreenAction: () => console.warn("getScreenAction not defined!")
};

const ConnectedMainForm = connect(mapStateToProps, mapDispatchToProps)(MainForm);

export default ConnectedMainForm;