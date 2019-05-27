import React from 'react';


class MainForm extends React.Component {


	render () {
		return (
			
			<h1>Realtime communication with WebRTC</h1>
			<div id="videos">
				<video id="localVideo" autoplay playsinline />
				<video id="remoteVideo" autoplay playsinline />
				<audio id="audio" autoplay />
			</div>

			<div>
				<button id="send">Send</button>
				<button id
			</div>
		);
	}
}