import React from "react";
import { Container, Row, Col } from "reactstrap";

import Document from "./Document";
import TeacherList from "./TeacherList";

import 'webrtc-adapter';
import { connect } from 'react-redux';
import PeerCreation from '../../../PeerCreation';
import * as peer_actions from '../../../redux/actions/peers';
import { get_user_media } from '../../../helpers/mediaDevices';
import { showToast } from '../../../helpers/toast';

import API_URL from '../../../config';

import docs from '../../../documents/docs';

const electron = window.require('electron');
const desktopCapturer = electron.desktopCapturer;
const ipcRenderer = electron.ipcRenderer;

class Index extends React.Component {
    constructor(props) {
		super(props);
		
		//Objects that don't require re-rendering upon update
		this.peercreation = new PeerCreation();
		this.audioStream = null;
		this.screenWidth = 1;
		this.screenHeight = 1;

        this.state = {
			task: 'scratch_lv4_inheritence',
			connectedTo: '',
			connectingTo: '',
            muted: false,
            deaf: false
        };
    }

    async componentDidMount() {
		// var room = prompt("Enter room name:");
		const username = this.props.auth.user.username;
		const token = this.props.auth.token;
		const room_name = this.props.auth.user.profile.classroom;

		// Connecting to chatroom
		const socket = new WebSocket('ws://' + API_URL + '/ws/signaling/' + room_name + '/');
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
			} else if (data.type == 'user_connected') {
				console.log("User " + data['username'] + " connected! Received new list of users.");
				console.log(data['users_arr']);
				this.props.update_online_users(data['users_arr']);
			} else if (data.type == 'user_disconnected') {
				console.log("User " + data['username'] + " disconnected! Received new list of users.")
				//close stream and destroy peer connection since connected peer has disconnected
				if (data['username'] == this.state.connectedTo) {
					this.handleShowAlert('Teacher: `' + this.state.connectedTo + '` has disconnected!', 'warning');
					this.disconnect();
				}
				this.props.update_online_users(data['users_arr']);
			}
		}
		socket.onclose = function (e) {
			console.error('Web socket connection closed!');
		}

		this.props.update_socket(socket);

		await this.getStream();
	}

	componentWillUnmount(){
		console.log("student view unmounting...cleaning up resources");
		this.cleanUpResources();
	}

	cleanUpResources(){
		this.disconnect();
		this.audioStream = null;
		if (this.props.socket.readyState === WebSocket.OPEN || this.props.socket.readyState === WebSocket.CONNECTING) {
			this.props.socket.close();
		}
		ipcRenderer.removeAllListeners();
	}

	async getStream() {
		desktopCapturer.getSources({ types: ['window', 'screen'] }, async (error, sources) => {
			for (const source of sources) {
				if (source.name === "Entire screen") {
					try {
						const stream = await get_user_media({
							audio: false,
							video: {
								mandatory: {
									chromeMediaSource: 'desktop',
									chromeMediaSourceId: source.id,
									maxWidth: 4000,
									maxHeight: 4000,
									minWidth: 1280,
									minHeight: 720
								}
							}
						});
						this.handleStream(stream);
					} catch (e) {
						console.log(e);
					}
					return;
				}
			}
		});
	}

	async getAudioSource() {
		return get_user_media({ video: false, audio: true });
	}

	async handleStream(stream) {
		this.audioStream = await this.getAudioSource();
		var audioTrack = this.audioStream.getAudioTracks()[0];
		stream.addTrack(audioTrack);
		this.localVideo.srcObject = stream;
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

	initiatePeer(username, initiator) {
		this.setState({ connectingTo: username });

		if (this.peercreation.initialized) {
			this.peercreation.destroy();
			console.log('Existing peer connection destroyed');
		}

		var stream = this.localVideo.srcObject;
		var my_peer = this.peercreation.init(stream, initiator);
		console.log('Initiated peer: ' + this.props.auth.user.username);

		my_peer.on('signal', (data) => {
			console.log('Websocket: send offer to ' + username);
			var msg = JSON.stringify({
				'offer': data,
				'to_username': username
			});
			if (this.props.socket.readyState === WebSocket.OPEN) {
				this.props.socket.send(msg);
			}
		})
		my_peer.on('connect', () => {
			this.setState({ connectedTo: username, connectingTo: '' });
			this.handleShowAlert('Teacher: `' + username + '` has connected to your screen!', 'primary');
			console.log('PEER CONNECTION SUCCESS!')
		})
		my_peer.on('data', (data) => {
			const dataObj = JSON.parse(data);
			if (dataObj.type == 'mouse_click') {
				this.ipcSendMouseClick(dataObj);
				console.log('Mouseclick: ' + dataObj.xRatio + ',' + dataObj.yRatio);
			} else if (dataObj.type == 'mouse_move') {
				this.ipcSendMouseMove(dataObj);
			} else if (dataObj.type == 'key_press') {
				this.ipcSendKeyPress(dataObj.keyCode, dataObj.modifiers);
				console.log('Keypress: ' + dataObj.keyCode);
			} else {
				this.handleShowAlert('WebRTC data channel received: ' + data, 'primary');
			}
		})
		my_peer.on('stream', stream => {
			this.remoteAudio.srcObject = stream;
		})
		my_peer.on('close', () => {
			this.disconnect();
			console.log('PEER CONNECTION CLOSED!');
		})
	}

	handleShowAlert = (msg, type) => {
		showToast('', msg, type);
	}

	notifyTeacher = (username) => {
		console.log('Websocket: send notify_user to ' + username);
		var msg = JSON.stringify({
			'notify': '',
			'to_username': username,
			'from_username': this.props.auth.user.username
		});
		if (this.props.socket.readyState === WebSocket.OPEN) {
			this.props.socket.send(msg);
			this.handleShowAlert("Sent a notification to " + username, "success");
		}
	}

	ipcSendMouseClick(data) {
		var x = Math.round(parseFloat(data.xRatio) * parseFloat(this.screenWidth));
		var y = Math.round(parseFloat(data.yRatio) * parseFloat(this.screenHeight));
		ipcRenderer.send('mouse-click', x, y);
	}

	ipcSendMouseMove(data) {
		var x = Math.round(parseFloat(data.xRatio) * parseFloat(this.screenWidth));
		var y = Math.round(parseFloat(data.yRatio) * parseFloat(this.screenHeight));
		ipcRenderer.send('mouse-move', x, y);
	}

	ipcSendKeyPress(keyCode, modifiers) {
		ipcRenderer.send('key-press', keyCode, modifiers);
	}

    render() {
        const { online_users } = this.props;
        const { muted, deaf, connectedTo, connectingTo, task } = this.state;

        return (
            <Container fluid className="p-0">
                <Row>
                    <Col lg="4" className="d-flex">
                        <TeacherList online_users={online_users} muted={muted} deaf={deaf}
									 notifyTeacher={this.notifyTeacher}
									 connectedTo={connectedTo}  
									 connectingTo={connectingTo} 
									 currentUsername={this.props.auth.user.username} 
									 muteVoice={this.muteVoice} muteSound={this.muteSound} />
                    </Col>
                    <Col lg="8" className="d-flex">
						<video style={{ display: 'none' }} id="localVideo" muted autoPlay playsInline 
						ref={video => (this.localVideo = video)} />
						<audio id="remoteAudio" autoPlay muted={deaf} ref={audio => (this.remoteAudio = audio)} />

                        <Document doc={docs[task]} />
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
