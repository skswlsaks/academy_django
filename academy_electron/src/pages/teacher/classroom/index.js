import React from "react";
import { Container, Row, Col } from "reactstrap";

import Screen from "./Screen";
import StudentList from "./StudentList";

import 'webrtc-adapter';
import { connect } from 'react-redux';
import PeerCreation from '../../../PeerCreation';
import * as peer_actions from '../../../redux/actions/peers';
import { get_user_media } from '../../../helpers/mediaDevices';
import { showToast } from '../../../helpers/toast';

class Index extends React.Component {
    constructor(props) {
		super(props);
		
        this.handleMouseMoveThrottled = this.throttled(300, this.handleMouseMove);
		
		//Objects that don't require re-rendering upon update
        this.peercreation = new PeerCreation();
        this.mousePosition = { x: null, y: null };
		this.audioStream = null;
		this.localAudio = null;
		this.remoteVideo = null;
		
		this.setLocalAudio = (audio) => {
			this.localAudio = audio;
		}

		this.setRemoteVideo = (video) => {
			this.remoteVideo = video;
		}

        this.state = {
            connectedTo: '',
            muted: false,
            deaf: false
        };
    }

    async componentDidMount(){
		document.addEventListener("keydown", this.handleKeyPress, false);

		// var room = prompt("Enter room name:");
		const username = this.props.auth.user.username;
		const token = this.props.auth.token;
		const room_name = 'room1';

		// Connecting to chatroom
		const socket = new WebSocket('ws://' + (process.env.REACT_APP_API_URL || 'www.tonyscoding.com:8000') + '/ws/signaling/' + room_name + '/');
		// const socket = new WebSocket('ws://' + (process.env.REACT_APP_API_URL || '127.0.0.1:8000') + '/ws/signaling/' + room_name + '/');
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
				console.log(data['users_arr']);
				this.props.update_online_users(data['users_arr']);
			} else if (data.type == 'user_disconnected') {
				console.log("User " + data['username'] + " disconnected! Received new list of users.")
				if (data['username'] == this.state.connectedTo) {
					this.handleShowAlert('Student: `' + this.state.connectedTo + '` has disconnected!', 'warning');
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

	componentWillUnmount(){
		console.log("teacher view unmounting...cleaning up resources");
		this.cleanUpResources();
	}

	cleanUpResources(){
		document.removeEventListener("keydown", this.handleKeyPress, false);
		this.disconnect();
		this.audioStream = null;
		if(this.props.socket.readyState === WebSocket.OPEN || this.props.socket.readyState === WebSocket.CONNECTING){
			this.props.socket.close();
		}
	}

	async getAudioSource(){
		return get_user_media({ video: false, audio: true });
	}

	async getStream(){
		this.audioStream = await this.getAudioSource();
		this.localAudio.srcObject = this.audioStream;
	}

	muteVoice = (flag) => {
		this.setState({ muted: flag });
		this.audioStream.getAudioTracks()[0].enabled = !flag;
	}

	muteSound = (flag) => {
		this.setState({ deaf: flag });
		//this.audioStream.getAudioTracks()[0].enabled = !flag;
	}

	disconnect(){
		this.setState({ connectedTo: '' });
		this.remoteVideo = null;
		if (this.peercreation.initialized) {
			this.peercreation.destroy();
		}
	}

	callUser = (username) => {
		this.initiatePeer(username, true);

		console.log('Websocket: send init_peer to ' + username);
		var msg = JSON.stringify({
			'init_peer': '',
			'to_username': username,
			'from_username': this.props.auth.user.username
		});
		if(this.props.socket.readyState === WebSocket.OPEN){
			this.props.socket.send(msg);
		}
	}

	initiatePeer(username, initiator){
		if (this.peercreation.initialized) {
			this.peercreation.destroy();
			console.log('Existing peer connection destroyed');
		}
		
		var stream = this.localAudio.srcObject;
		var my_peer = this.peercreation.init(stream, initiator);
		console.log('Initiated peer: ' + this.props.auth.user.username);

		my_peer.on('signal', (data) => {
			console.log('Websocket: send offer to ' + username);
			var msg = JSON.stringify({
				'offer': data,
				'to_username': username
			});
			if(this.props.socket.readyState === WebSocket.OPEN){
				this.props.socket.send(msg);
			}
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

	handleMouseClick = (e) => {
		if (this.isFullscreen() && this.state.connectedTo) {
			const data = JSON.stringify({
				type: 'mouse_click',
				xRatio: this.mousePosition.xRatio,
				yRatio: this.mousePosition.yRatio
			});
			this.peercreation.peer.send(data);
		} else {
			// this.openFullscreen();
		}
	}

	handleMouseMove = (e) => {
		if (this.isFullscreen() && this.state.connectedTo) {
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

	handleKeyPress = (e) => {
		if (this.isFullscreen() && this.state.connectedTo) {
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

	handleShowAlert = (msg, type) => {
		showToast('', msg, type);
	}

	isFullscreen(){
		return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
	}

	openFullscreen = () => {
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

	throttled(delay, fn){
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
        const { online_users } = this.props;
        const { muted, deaf, connectedTo } = this.state;

        return (
            <Container fluid className="p-0">
                <Row>
                    <Col lg="4" className="d-flex">
                        <StudentList online_users={online_users} 
									 callUser={this.callUser} 
									 connectedTo={connectedTo} 
									 currentUsername={this.props.auth.user.username} 
						/>
                    </Col>
                    <Col lg="8" className="d-flex">
                        <Screen muted={muted} deaf={deaf} muteVoice={this.muteVoice} muteSound={this.muteSound} 
								setRemoteVideo={this.setRemoteVideo} setLocalAudio={this.setLocalAudio} 
								handleMouseClick={this.handleMouseClick} openFullscreen={this.openFullscreen}
								handleMouseMoveThrottled={this.handleMouseMoveThrottled} />
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
	online_users: state.peer_manager.online_users,
	socket: state.peer_manager.socket,
	auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
	update_online_users: (online_users) => dispatch(peer_actions.update_online_users(online_users)),
	update_socket: (socket) => dispatch(peer_actions.update_socket(socket))
});

const ConnectedIndex = connect(mapStateToProps, mapDispatchToProps)(Index);

export default ConnectedIndex;
