import React from 'react';


class MainForm extends React.Component {


	render () {
		return (
			<div>
			<h1>Realtime communication with WebRTC</h1>
			<div id="videos">
				<video id="localVideo" autoPlay playsInline />
				<video id="remoteVideo" autoPlay playsInline />
				<audio id="audio" autoPlay />
			</div>

			<div>
				<button id="send">Send</button>
				<button id="get_screen">Get screen</button>
				<button id="call">Call</button>
				<button id="sendData">Data send</button>
			</div>
			</div>
		);
	}
}

export default MainForm;