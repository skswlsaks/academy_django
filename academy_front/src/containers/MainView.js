import React from 'react';
import Websocket from 'react-websocket';
import '../style/MainView.css';
import PropTypes from 'prop-types';


class MainForm extends React.Component {

	constructor (props) {
		super(props);
		
		this.handleData = this.handleData.bind(this);
		this.handleCloseConnection = this.handleCloseConnection.bind(this);
		this.getScreenAction = this.getScreenAction.bind(this);
		// this.getScreenStream = this.getScreenStream.bind(this);

		this.state = {
			localVideo: {},
			remoteVideo: null
		};
	}

	handleData(e) {
		var data = JSON.parse(e.data);
		var message = data['message'];
		console.log('respond from onMessage: ', message);
	}

	handleCloseConnection(e) {
		console.error('Chat socket closed unexpectedly! -Jeff');
	}

	getScreenStream(callback) {
		if (navigator.getDisplayMedia) {
			navigator.getDisplayMedia({
				video: true
			}).then(screenStream => {
				callback(screenStream);
			});
		} else if (navigator.mediaDevices.getDisplayMedia) {
			navigator.mediaDevices.getDisplayMedia({
				video: true
			}).then(screenStream => {
				callback(screenStream);
			});
		}
	}

	getScreenAction() {
		// var localStream = navigator.mediaDevices.getDisplayMedia({
		// 	video: true
		// });
		// this.setState({localVideo: localStream});
		// this.getScreenStream(function(screenStream) {
		// 	console.log('Adding local stream.');
		// 	this.localVideo.srcObject = screenStream;
		// 	this.setState({localStream: screenStream});
		// })

		const op = {
			video: true
		};
		navigator.mediaDevices.getDisplayMedia(
			op
		).then(stream => {
			this.setState({localVideo: stream});
			this.localVideo.srcObject = stream;
		});
	}

	render () {
		return (
			<div>
			<h1>Realtime communication with WebRTC</h1>
			<div className="video-wrapper" id="videos">
				<video id="localVideo" autoPlay playsInline ref={video => (this.localVideo = video)} />
				
				<video id="remoteVideo" autoPlay playsInline />
				<audio id="audio" autoPlay />
			</div>

			<div>
				<button id="send">Send</button>
				<button id="get_screen" onClick={this.getScreenAction}>Get screen</button>
				<button id="call">Call</button>
				<button id="sendData">Data send</button>
			</div>

			{/* <Websocket url={'ws://' + localStorage.getItem('host') +'/ws/signaling/' + localStorage.getItem('room') + '/'}
				onClose={this.handleCloseConnection}
				onMessage={this.handleData}
				/> */}
			</div>
		);
	}
}

MainForm.propTypes = {
	getScreenAction: PropTypes.func
};

MainForm.defaultProps = {
	getScreenAction: () => console.warn("getScreenAction not defined!")
};

export default MainForm;