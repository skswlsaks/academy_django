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
		this.connectToRoom = this.connectToRoom.bind(this);
		this.signalling = this.signalling.bind(this);
	
		this.state = {
			localVideo: {},
			initiator: false,
			chatSocket: null,
			all_peers: {}
		};

	}

	peercreation = new PeerCreation();
	my_peer = {};

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
			var message = data['peers'];
			console.log("chatSocket from onmessage: ");
			console.log(message);
			that.props.update_peer(message);

		}

		newSocket.onclose = function(e) {
			console.error('Chat socket closed unexpectedly!');
		}
		
		var peer = await this.getScreenAction()
		var msg = JSON.stringify({
			'peer': await peer
		});
		console.log(msg);
		newSocket.send(msg);

		this.setState({
			...this.state,
			chatSocket: newSocket
		})
		this.connectToRoom();	
	}



	handleData(e) {
		var data = JSON.parse(e.data);
		var message = data['message'];
		console.log('respond from onMessage: ', message);
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
		console.log(stream);
		this.initiator = true;
		this.localVideo.srcObject = await stream;
		var cur_peer = this.peercreation.init(await stream, this.state.initiator);
		this.setState({
			localVideo: await stream,
			my_peer: cur_peer
		});

		return cur_peer;
	}

	connectToRoom() {
		this.state.my_peer.on('signal', data => {
            
		})
		
		console.log(this.props.peers);
        this.state.my_peer.on('stream', stream => {
            this.remoteVideo.srcObject = stream
        })
        this.state.my_peer.on('error', function (err) { 
            console.log(err)
        })
	}

	signalling() {
		// for (var pee in this.props.all_peers) {
		// 	if (pee['id'] !== this.state.my_peer['id']) {
		// 		this.state.my_peer.connect(pee);
		// 		break;
		// 	}
		// }

		var pppp = this.props.all_peers;
		console.log("Start")
		Object.keys(pppp).map((key, index) => {
			console.log(key, pppp[key])
		})

	}

	render () {

		const { all_peers } = this.props;
		console.log(all_peers);
		return (
			<div>
			<h1>Realtime communication with WebRTC</h1>
			{
				Object.keys(all_peers).map((key, index) => {
					<UserThumbNail username={key}></UserThumbNail>
				})
			}
			<UserThumbNail username={"Marry"}></UserThumbNail>
			<div className="video-wrapper" id="videos">
				<video id="localVideo" autoPlay playsInline ref={video => (this.localVideo = video)} />
				<video id="remoteVideo" autoPlay playsInline ref={video => (this.remoteVideo = video)}/>
				<audio id="audio" autoPlay />
			</div>

			<div>
				<button id="send" >Send</button>
				<button id="get_screen" onClick={this.getScreenAction}>Get screen</button>
				<button id="call" onClick={this.signalling}>Signal</button>
				<button id="sendData" >Data send</button>
			</div>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	update_peer: (peers) =>{
		dispatch (actions.update_peer(peers));
	}
});

const mapStateToProps = (state) => {
	console.log("from mapstate")
	console.log(state);
	return {
		all_peers: state.peers,
		my_peer: state.my_peer
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