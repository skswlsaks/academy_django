import React from 'react';
import Websocket from 'react-websocket';

class MainForm extends React.Component {

	constructor (props) {
		super(props);
		
		this.handleData = this.handleData.bind(this);
		this.handleCloseConnection = this.handleCloseConnection.bind(this);
		this.getScreenAction = this.getScreenAction.bind(this);
		// this.getScreenStream = this.getScreenStream.bind(this);

		this.state = {
			localVideo: null,
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
		var localStream = navigator.mediaDevices.getDisplayMedia({
			video: true
		});
		this.setState({localVideo: localStream});
		// this.getScreenStream(function(screenStream) {
		// 	console.log('Adding local stream.');
		// 	// localStream = screenStream;
		// 	this.setState({localVideo: screenStream});
		// })
	}

	render () {
		const localvideo = this.state.localVideo;
		return (
			<div>
			<h1>Realtime communication with WebRTC</h1>
			<div id="videos">
				<video id="localVideo" autoPlay playsInline ref={localvideo}>
					<source src={localvideo} />
				</video>
				<video id="remoteVideo" autoPlay playsInline />
				<audio id="audio" autoPlay />
			</div>

			<div>
				<button id="send">Send</button>
				<button id="get_screen" onClick={this.getScreenAction}>Get screen</button>
				<button id="call">Call</button>
				<button id="sendData">Data send</button>
			</div>

			<Websocket url={'ws://' + localStorage.getItem('host') +'/ws/signaling/' + localStorage.getItem('room') + '/'}
				onClose={this.handleCloseConnection}
				onMessage={this.handleData}
				/>
			</div>
		);
	}
}

export default MainForm;