// docker run -p 6379:6379 -d redis

import React from 'react';
import '../style/Main.css';
import PropTypes from 'prop-types';
import PeerCreation from '../Peers/peer';
import UserThumbNail from '../components/UserThumbNail';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import 'webrtc-adapter';
import * as actions from '../actions/peers';
import { throws } from 'assert';

class MainView extends React.Component {
	constructor(props) {
		super(props);
		this.getScreenAction = this.getScreenAction.bind(this);
		this.callUser = this.callUser.bind(this);
	}

	peercreation = new PeerCreation();

	async componentDidMount() {
		// var room = prompt("Enter room name:");
		const username = this.props.auth.user.username;
		const token = this.props.auth.token;
		const room_name = 'room1';

		// Connecting to chatroom
		const socket = new WebSocket('ws://127.0.0.1:8000/ws/signaling/' + room_name + '/');
		socket.onopen = (e) => {
			//send authentication token to server
			socket.send(JSON.stringify({access_token: token}));
		}
		socket.onmessage = (e) => {
			var data = JSON.parse(e.data);
			if (data.type == 'offer') {
				if (data['to_username'] == username) {
					console.log("Websocket: received " + data.type);
					console.log("Signaling offered peer...");
					this.peercreation.connect(data['peer_data']); //send signal
				} 
			}else if (data.type == 'init_peer') {
				if (data['to_username'] == username) {
					console.log("Websocket: received " + data.type);
					this.initiatePeer(data['from_username'], false);
				} 
			}else if (data.type == 'user_connected') {
				console.log("User " + data['username'] + " connected! Received new list of users.");
				this.props.update_peer(data['peers']);
			}else if (data.type == 'user_disconnected') {
				console.log("User " + data['username'] + " disconnected! Received new list of users.")
				this.props.update_peer(data['peers']);
				//close stream and destroy peer connection
				//ONLY IF disconnected_user.username == current auth.user->remotePeer.username
				//this.remoteVideo.srcObject = null;
				//this.peercreation.destroy();

			}
		}
		socket.onclose = function (e) {
			console.error('Web socket connection closed!');
		}
		
		this.props.update_socket(socket);

		await this.getScreenAction()
	}

	async getSource() {
		if (navigator.getDisplayMedia) {
			return navigator.getDisplayMedia({ video: true });
		} else if (navigator.mediaDevices.getDisplayMedia) {
			return navigator.mediaDevices.getDisplayMedia({ video: true });
		}
	}

	async getScreenAction() {
		var stream = await this.getSource();
		this.props.update_localstream(stream);
		this.localVideo.srcObject = stream;
	}

	callUser(username){
		this.initiatePeer(username, true);

		console.log('Websocket: send init_peer to ' + username);
		var msg = JSON.stringify({
			'init_peer': '',
			'to_username': username,
			'from_username': this.props.auth.user.username
		});
		this.props.socket.send(msg);
	}

	initiatePeer(username, initiator){
		var stream = this.props.local_stream;
		var my_peer = this.peercreation.init(stream, initiator);
		console.log('Initiated peer: ' + this.props.auth.user.username);

		my_peer.on('signal', (data) => {
			console.log('Websocket: send offer to ' + username);
			var msg = JSON.stringify({
				'offer': data,
				'to_username': username
			});
			this.props.socket.send(msg);
		})
		my_peer.on('connect', () => {
			console.log('PEER CONNECTION SUCCESS!')
		})
		my_peer.on('stream', stream => {
			this.remoteVideo.srcObject = stream
		})
	}

	render() {
		const { all_peers } = this.props;
		console.log(all_peers);

		return (
			<div className="main-view">
				<h1>Realtime communication with WebRTC</h1>
				<div className="thumbnail-wrapper">
					{
						Object.keys(all_peers).map((key, index) => {
							if(key!=this.props.auth.user.username){
								return (
									<UserThumbNail username={key} key={index} callUser={this.callUser}/>
								);
							}
						})
					}
				</div>
				<div className="video-wrapper" id="videos">
					<video id="localVideo" autoPlay playsInline ref={video => (this.localVideo = video)} />
					<video id="remoteVideo" autoPlay playsInline ref={video => (this.remoteVideo = video)}/>
					<audio id="audio" autoPlay />
				</div>

				<div className="buttons">
					<Button variant="primary" id="send" onClick={this.changeInit}>Send</Button>
					<Button variant="success" id="get_screen" onClick={this.getScreenAction}>Get screen</Button>
					<Button variant="info" id="call">Call</Button>
					<Button variant="warning" id="sendData">Data send</Button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	all_peers: state.peer_manager.peers,
	my_peer: state.peer_manager.my_peer, //SEEMS REDUNDANT (CAN DELETE? discuss with Jeff)
	local_stream: state.peer_manager.local_stream, //SEEMS REDUNDANT (CAN DELETE? discuss with Jeff)
	socket: state.peer_manager.socket,
	auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
	update_peer: (peer) => dispatch(actions.update_peer(peer)),
	update_my_peer: (my_peer) => dispatch (actions.update_my_peer(my_peer)),  //SEEMS REDUNDANT (CAN DELETE? discuss with Jeff)
	update_localstream: (stream) => dispatch(actions.update_localstream(stream)), //SEEMS REDUNDANT (CAN DELETE? discuss with Jeff)
	update_socket: (socket) => dispatch (actions.update_socket(socket))
});

MainView.propTypes = {
	getScreenAction: PropTypes.func
};

MainView.defaultProps = {
	getScreenAction: () => console.warn("getScreenAction not defined!")
};

const ConnectedMainView = connect(mapStateToProps, mapDispatchToProps)(MainView);

export default ConnectedMainView;