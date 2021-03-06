// docker run -p 6379:6379 -d redis
import React from 'react';
import '../style/Main.css';
import PropTypes from 'prop-types';
import PeerCreation from '../Peers/peer';
import Thumbnail from '../components/Thumbnail';
import { connect } from 'react-redux';
import 'webrtc-adapter';
import AlertMessage from '../components/AlertMessage';
import * as peer_actions from '../actions/peers';
import * as alert_actions from '../actions/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { get_user_media, get_display_media } from '../helpers/mediaDevices';

class StudentView extends React.Component {
	constructor(props) {
		super(props);
		this.getStream = this.getStream.bind(this);
		this.notifyTeacher = this.notifyTeacher.bind(this);
		this.peercreation = new PeerCreation();
		this.muteVoice = this.muteVoice.bind(this);
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
				this.props.update_online_users(data['users_arr']);
			}else if (data.type == 'user_disconnected') {
				console.log("User " + data['username'] + " disconnected! Received new list of users.")
				if(data['username'] == this.state.connectedTo){
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
		return get_display_media({ video: true, audio: true });
	}

	async getAudioSource() {
		return get_user_media({ video: false, audio: true });
	}

	async getStream() {
		var stream = await this.getSource();
		var audioStream = await this.getAudioSource();
		var audioTrack = audioStream.getAudioTracks()[0];
		stream.addTrack(audioTrack);
		this.audioStream = stream;
		this.localVideo.srcObject = stream;
	}

	muteVoice(flag){
		this.setState({ muted: flag });
		this.audioStream.getAudioTracks()[0].enabled = !flag;
	}

	disconnect(){
		this.handleShowAlert('Teacher: `' + this.state.connectedTo + '` has disconnected from your screen!', 'warning');
		this.setState({connectedTo: ''});
	}

	initiatePeer(username, initiator){
		var stream = this.localVideo.srcObject;
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
			this.setState({connectedTo: username});
			this.handleShowAlert('Teacher: `' + username + '` has connected to your screen!', 'primary');
			console.log('PEER CONNECTION SUCCESS!')
		})
		my_peer.on('data', (data) => {
			const dataObj = JSON.parse(data);
			if(dataObj.type == 'mouse_click'){
				this.handleShowAlert('WebRTC data channel received: mouse_click at ' + dataObj.xRatio + ',' + dataObj.yRatio, 'primary');
			}else{
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

	notifyTeacher(username){
		console.log('Websocket: send notify_user to ' + username);
		var msg = JSON.stringify({
			'notify': '',
			'to_username': username,
			'from_username': this.props.auth.user.username
		});
		this.props.socket.send(msg);
	}

	handleShowAlert(msg, type) {
		this.props.show_alert(msg, type);
		setTimeout(() => {
			this.props.hide_alert();
		}, 3000);
	}

	render() {
		const { online_users, show_alert, alert_msg, alert_type } = this.props;
		const { muted } = this.state;
		console.log(online_users);

		return (
			<div className="main-view">
				<h1>Realtime communication with WebRTC</h1>
				<AlertMessage msg={alert_msg} type={alert_type} showAlert={show_alert} />
				<div className="thumbnail-wrapper">
					{
						Object.keys(online_users).map((username, index) => {
							if(username!=this.props.auth.user.username && online_users[username]==true){
								return (this.state.connectedTo==username) ? (
									<Thumbnail connected={true} key={index} username={username} notifyTeacher={this.notifyTeacher}/>
								) : (
									<Thumbnail key={index} username={username} notifyTeacher={this.notifyTeacher}/>
								);
							}
						})
					}
				</div>
				<button id="testbutton">CLICK ME FOR FUN!</button>
				<div className="video-wrapper" id="videos">
					<video id="localVideo" autoPlay playsInline ref={video => (this.localVideo = video)} />
					<audio id="remoteAudio" autoPlay ref={audio => (this.remoteAudio = audio)}/>
					<div>
						{ muted ? <FontAwesomeIcon onClick={()=>{this.muteVoice(false)}} icon="microphone-slash" style={{color:"#ff2222"}} size="3x"/> 
						: <FontAwesomeIcon onClick={()=>{this.muteVoice(true)}} icon="microphone" style={{color:"#6DB65B"}} size="3x"/> }
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
	update_socket: (socket) => dispatch (peer_actions.update_socket(socket)),
	show_alert: (msg, type) => dispatch(alert_actions.show_alert(msg, type)),
	hide_alert: () => dispatch(alert_actions.hide_alert())
});

StudentView.propTypes = {
	getScreenAction: PropTypes.func
};

StudentView.defaultProps = {
	getScreenAction: () => console.warn("getScreenAction not defined!")
};

const ConnectedStudentView = connect(mapStateToProps, mapDispatchToProps)(StudentView);

export default ConnectedStudentView;