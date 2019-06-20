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

class MainView extends React.Component {
	constructor(props) {
		super(props);

		this.getScreenAction = this.getScreenAction.bind(this);
		this.changeInit = this.changeInit.bind(this);
	}

	peercreation = new PeerCreation();

	async componentDidMount() {
		// var room = prompt("Enter room name:");
		const username = this.props.auth.user.username;
		const token = this.props.auth.token;
		const room_name = 'room1';

		// Connecting to chatroom
		const socket = new WebSocket('ws://127.0.0.1:8000/ws/signaling/' + room_name + '/');
		const that = this;
		socket.onopen = function (e) {
			//send authentication token to server
			socket.send(JSON.stringify({access_token: token}));
		}
		socket.onmessage = function (e) {
			var data = JSON.parse(e.data);
			console.log("chatSocket from onmessage: ");
			if (data.type == 'peer') {
				const peers = data['peers'];
				that.props.update_peer(peers);
			} else if (data.type == 'call') {
				if (data['peers'] == that.props.my_peer['_id']) {
					console.log("receiving call")
					that.connectToRoom(data['called']);
				}
			} else if (data.type == 'receive_call') {
				console.log("connected!")
				if (data['receiver'] == that.props.my_peer['_id']) {
					console.log("connected!")
					that.props.peercreation.connect(data['data'])
				}
			} else if (data.type == 'user_disconnected') {
				console.log("user: " + data['username'] + " disconnected!")
				that.props.update_peer(data['peers']);
			}
		}
		socket.onclose = function (e) {
			console.error('Web socket connection closed!');
		}

		await this.getScreenAction()
		var msg = JSON.stringify({
			'peer': this.props.my_peer
		});
		socket.send(msg);

		this.props.update_socket(socket);

	}

	async getSource() {
		if (navigator.getDisplayMedia) {
			return navigator.getDisplayMedia({ video: true });
		} else if (navigator.mediaDevices.getDisplayMedia) {
			return navigator.mediaDevices.getDisplayMedia({ video: true });
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
		//initialise cur_peer here

		my_peer.on('signal', (data) => {
			console.log('sending signal to remote peer!');
			var msg = JSON.stringify({
				'receive_call': receiver,
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

	render() {
		const { all_peers } = this.props;
		console.log("from rendering!");
		console.log(this.props);

		return (
			<div className="main-view">
				<h1>Realtime communication with WebRTC</h1>
				<div className="thumbnail-wrapper">
					{
						Object.keys(all_peers).map((key, index) => {
							return (
								<UserThumbNail username={key} key={index} />
							);
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
	my_peer: state.peer_manager.my_peer,
	local_video: state.peer_manager.local_video,
	socket: state.peer_manager.socket,
	auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
	update_peer: (peer) => dispatch(actions.update_peer(peer)),
	update_my_peer: (my_peer, peercreation) => dispatch (actions.update_my_peer(my_peer, peercreation)),
	update_localstream: (stream) => dispatch(actions.update_localstream(stream)),
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