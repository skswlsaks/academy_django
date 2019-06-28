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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { get_user_media } from '../helpers/mediaDevices';

const FULLSCREEN_MODE = false;

class TeacherView extends React.Component {
	constructor(props) {
		super(props);
		this.callUser = this.callUser.bind(this);
		this.handleMouseClick = this.handleMouseClick.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleMouseMoveThrottled = this.throttled(1000, this.handleMouseMove);
		this.muteVoice = this.muteVoice.bind(this);
		this.peercreation = new PeerCreation();
		this.mousePosition = { x: null, y: null };
		this.audioStream = null;

		this.state = {
			connectedTo: '',
			muted: false
		};
	}

	async componentDidMount() {
		document.addEventListener("keydown", this.handleKeyPress, false);

		// var room = prompt("Enter room name:");
		const username = this.props.auth.user.username;
		const token = this.props.auth.token;
		const room_name = 'room1';

		// Connecting to chatroom
		const socket = new WebSocket('ws://' + (process.env.REACT_APP_API_URL || 'www.tonyscoding.com:8000') + '/ws/signaling/' + room_name + '/');

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

	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyPress, false);
	}

	async getAudioSource() {
		return get_user_media({ video: false, audio: true });
	}

	async getStream() {
		this.audioStream = await this.getAudioSource();
		this.localAudio.srcObject = this.audioStream;
	}

	muteVoice(flag) {
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
			document.removeEventListener("keydown", this.handleKeyPress, false);
			console.log('PEER CONNECTION CLOSED!');
		})
		my_peer.on('stream', stream => {
			this.remoteVideo.srcObject = stream;
		})
	}

	handleMouseClick() {
		if (this.isFullscreen()) {
			const data = JSON.stringify({
				type: 'mouse_click',
				xRatio: this.mousePosition.xRatio,
				yRatio: this.mousePosition.yRatio
			});
			this.peercreation.peer.send(data);
		} else {
			this.openFullscreen();
		}
	}

	handleMouseMove(e) {
		if (this.isFullscreen()) {
			var xVal = e.nativeEvent.offsetX;
			var yVal = e.nativeEvent.offsetY;
			xVal = xVal < 0 ? 0 : xVal;
			yVal = yVal < 0 ? 0 : yVal;
			this.mousePosition = { xRatio: xVal / this.remoteVideo.offsetWidth, yRatio: yVal / this.remoteVideo.offsetHeight };

			const data = JSON.stringify({
				type: 'mouse_move',
				xRatio: this.mousePosition.xRatio,
				yRatio: this.mousePosition.yRatio
			});
			this.peercreation.peer.send(data);
		}
	}

	handleKeyPress(e) {
		if (this.isFullscreen()) {
			if (e.isComposing || e.keyCode === 229) {
				return;
			}

			var modifiers = [];
			if (e.ctrlKey) modifiers.push('control')
			if (e.altKey) modifiers.push('alt')
			if (e.shiftKey) modifiers.push('shift')
			if (e.metaKey) modifiers.push('command')

			this.peercreation.peer.send(JSON.stringify({ type: 'key_press', keyCode: e.keyCode, modifiers: modifiers }));
		}
	}

	handleShowAlert(msg, type) {
		this.props.show_alert(msg, type);
		setTimeout(() => {
			this.props.hide_alert();
		}, 3000);
	}

	isFullscreen() {
		return !FULLSCREEN_MODE || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
	}

	openFullscreen() {
		var elem = this.remoteVideo;
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) { /* Firefox */
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) { /* IE/Edge */
			elem.msRequestFullscreen();
		}
	}

	throttled(delay, fn) {
		let lastCall = 0;
		return function (...args) {
			const now = (new Date).getTime();
			if (now - lastCall < delay) {
				return;
			}
			lastCall = now;
			return fn(...args);
		}
	}

render() {
	const { online_users, show_alert, alert_msg, alert_type } = this.props;
	const { muted } = this.state;

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
							) : (
									<Thumbnail key={index} username={username} callUser={this.callUser} />
								);
						}
					})
				}
			</div>
			<div className="video-wrapper" id="videos">
				<video id="remoteVideo" autoPlay playsInline ref={video => (this.remoteVideo = video)}
					onClick={this.handleMouseClick}
					onMouseMove={this.handleMouseMoveThrottled} controls={false} />
				<audio id="localAudio" muted="muted" autoPlay ref={audio => (this.localAudio = audio)} />
				<div>
					{muted ? <FontAwesomeIcon onClick={() => { this.muteVoice(false) }} icon="microphone-slash" style={{ color: "#ff2222" }} size="3x" />
						: <FontAwesomeIcon onClick={() => { this.muteVoice(true) }} icon="microphone" style={{ color: "#6DB65B" }} size="3x" />}
				</div>
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