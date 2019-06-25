// docker run -p 6379:6379 -d redis
import React from 'react';
import '../style/Main.css';
import PeerCreation from '../Peers/peer';
import Thumbnail from '../components/Thumbnail';
import AlertMessage from '../components/AlertMessage';
import { connect } from 'react-redux';
import 'webrtc-adapter';
import * as peer_actions from '../actions/peers';
import * as alert_actions from '../actions/alert';

class TeacherView extends React.Component {
	constructor(props) {
		super(props);
		this.callUser = this.callUser.bind(this);
		this.handleMouseClick = this.handleMouseClick.bind(this);
		this.peercreation = new PeerCreation();
		this.mouseOffset = { x: null, y: null };
		this.audioStream = null;

		this.state = {
			connectedTo: '',
			muted: false
		};
	}

	async componentDidMount() {
		// var room = prompt("Enter room name:");
		const username = this.props.auth.user.username;
		const token = this.props.auth.token;
		const room_name = 'room1';

		// Connecting to chatroom
		const socket = new WebSocket('ws://127.0.0.1:8000/ws/signaling/' + room_name + '/');

		socket.onopen = (e) => {
			//send authentication token to server
			socket.send(JSON.stringify({ access_token: token }));
		}
		socket.onmessage = (e) => {
			var data = JSON.parse(e.data);
			if (data.type == 'offer') {
				if (data['to_username'] == username) {
					console.log("Websocket: received " + data.type);
					console.log("Signaling offered peer...");
					this.peercreation.connect(data['peer_data']); //send signal
				}
			} else if (data.type == 'init_peer') {
				if (data['to_username'] == username) {
					console.log("Websocket: received " + data.type);
					this.initiatePeer(data['from_username'], false);
				}
			} else if (data.type == 'notify') {
				if (data['to_username'] == username) {
					console.log("Websocket: received " + data.type);
					const msg = "Student: `" + data['from_username'] + "` needs your help!";
					this.handleShowAlert(msg, 'success');
				}
			} else if (data.type == 'user_connected') {
				console.log("User " + data['username'] + " connected! Received new list of users.");
				this.props.update_online_users(data['users_arr']);
			} else if (data.type == 'user_disconnected') {
				console.log("User " + data['username'] + " disconnected! Received new list of users.")
				if (data['username'] == this.state.connectedTo) {
					this.disconnect();
				}
				this.props.update_online_users(data['users_arr']);
				//close stream and destroy peer connection
				//ONLY IF disconnected_user.username == current auth.user->remotePeer.username
				//this.remoteVideo.srcObject = null;
				//this.signaling.peercreation.destroy();

			}
		}
		socket.onclose = function (e) {
			console.error('Web socket connection closed!');
		}

		this.props.update_socket(socket);

		await this.getStream();
	}
	
	async getSource() {
		if (navigator.mediaDevices.getUserMedia) {
			return navigator.mediaDevices.getUserMedia({ video: false, audio: true });
		} else if (navigator.getUserMedia) {
			return navigator.getUserMedia({ video: false, audio: true });
		}
	}

	async getStream() {
		var stream = await this.getSource();
		this.audioStream = stream;
		this.localAudio.srcObject = stream
	}

	muteVoice(flag){
		this.setState({ muted: flag });
		this.audioStream.getAudioTracks()[0].enabled = !flag;
	}

	disconnect() {
		this.handleShowAlert('Student: `' + this.state.connectedTo + '` has disconnected!', 'warning');
		this.setState({ connectedTo: '' });
		this.remoteVideo.srcObject = null;
	}

	callUser(username) {
		this.initiatePeer(username, true);

		console.log('Websocket: send init_peer to ' + username);
		var msg = JSON.stringify({
			'init_peer': '',
			'to_username': username,
			'from_username': this.props.auth.user.username
		});
		this.props.socket.send(msg);
	}

	initiatePeer(username, initiator) {
		if (this.peercreation.initialized) {
			this.peercreation.destroy();
			console.log('Existing peer connection destroyed');
		}
		var my_peer = this.peercreation.init(null, initiator);
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
			this.setState({ connectedTo: username });
			console.log('PEER CONNECTION SUCCESS!');
		})
		my_peer.on('close', () => {
			this.disconnect();
			console.log('PEER CONNECTION CLOSED!');
		})
		my_peer.on('stream', stream => {
			this.remoteVideo.srcObject = stream;
		})
	}

	handleMouseClick() {
		//normalize screen coordinates relative to video element
		// var videoElementPos = this.remoteVideo.getBoundingClientRect();
		// var normalizedX = this.state.screenX - videoElementPos.left;
		// var normalizedY = this.state.screenY - videoElementPos.top;
		const xRatio = this.mouseOffset.x / this.remoteVideo.offsetWidth;
		const yRatio = this.mouseOffset.y / this.remoteVideo.offsetHeight;
		const data = JSON.stringify({
			type: 'mouse_click', 
			xRatio: xRatio, 
			yRatio: yRatio
		});
		this.peercreation.peer.send(data);
	}

	handleMouseMove(e) {
		var xVal = e.nativeEvent.offsetX;
		var yVal = e.nativeEvent.offsetY;
		this.mouseOffset = { x: xVal < 0 ? 0 : xVal, y: yVal < 0 ? 0 : yVal };
		// var mouse = robotjs.getMousePos();
		// console.log(mouse.x + "," + mouse.y);
	}

	handleShowAlert(msg, type) {
		this.props.show_alert(msg, type);
		setTimeout(() => {
			this.props.hide_alert();
		}, 3000);
	}

	render() {
		const { online_users, show_alert, alert_msg, alert_type } = this.props;
		console.log(online_users);

		return (
			<div className="main-view">
				<h1>Realtime communication with WebRTC</h1>
				<AlertMessage msg={alert_msg} type={alert_type} showAlert={show_alert} />
				<div className="thumbnail-wrapper">
					{
						Object.keys(online_users).map((username, index) => {
							if (username != this.props.auth.user.username && online_users[username] == false) {
								return (this.state.connectedTo == username) ? (
									<Thumbnail connected={true} key={index} username={username} callUser={this.callUser} />
								)
									: (
										<Thumbnail key={index} username={username} callUser={this.callUser} />
									);
							}
						})
					}
				</div>
				<div className="video-wrapper" id="videos">
					{/* Remote audio is included */}
					<video id="remoteVideo" autoPlay playsInline ref={video => (this.remoteVideo = video)}
						onClick={this.handleMouseClick}
						onMouseMove={this.handleMouseMove.bind(this)} />
					<audio id="localAudio" autoPlay ref={audio => (this.localAudio = audio)}/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	online_users: state.peer_manager.online_users,
	socket: state.peer_manager.socket,
	show_alert: state.alert.show,
	alert_msg: state.alert.msg,
	alert_type: state.alert.type,
	auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
	update_online_users: (online_users) => dispatch(peer_actions.update_online_users(online_users)),
	update_socket: (socket) => dispatch(peer_actions.update_socket(socket)),
	show_alert: (msg, type) => dispatch(alert_actions.show_alert(msg, type)),
	hide_alert: () => dispatch(alert_actions.hide_alert())
});

const ConnectedTeacherView = connect(mapStateToProps, mapDispatchToProps)(TeacherView);

export default ConnectedTeacherView;