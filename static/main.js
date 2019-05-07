// docker run -p 6379:6379 -d redis

'use strict';

var isInitiator;
// var robot = require('robotjs');

window.room = prompt("Enter room name:");
window.user = prompt("User?");

// auth -> (Teacher or Student) => (true => student) and (false => teacher)
var auth = false;
var chatSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/signaling/' + window.room + '/');

var pm = 'Hi there!';
const sendButton = document.getElementById('send');
const getscreenButton = document.getElementById('get_screen');
const callButton = document.getElementById('call');
var localVideo = document.querySelector('#localVideo');
var remoteVideo = document.querySelector('#remoteVideo');
var localStream;
var remoteStream;
var isInitiator = false;
var isStarted = false;
var isChannelReady = false;
var pc = new RTCPeerConnection({
                iceServers: [     // Information about ICE servers - Use your own!
                  {
                    urls: "stun:stun.l.google.com:19302"//,  // A TURN server
                    //username: "webrtc",
                    //credential: "turnserver"
                  }
                ]
            });


// Websocket handling methods
chatSocket.onopen = function(e) {};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly!');
}

chatSocket.onmessage = function(e) {
    var data = JSON.parse(e.data);
    var message = data['message'];
    console.log('respond from onmessage:', message);
    if (message === 'Student media ready') {
        // maybeStart();
        // console.log('respond from onmessage:', message);
    } else if (message.type === 'offer' ) {
        console.log('Offer received!')
        if (!isInitiator && !isStarted) {
            receiveOffer();
        }
        pc.setRemoteDescription(new RTCSessionDescription(message));
        doAnswer();
    } else if (message.type === 'answer') {
        console.log('Got Answered!')
        pc.setRemoteDescription(new RTCSessionDescription(message));
        
        // && window.user !== message.client
        // window.user === 'r'
        // window.user === 's'
    } else if (message.type === 'candidate' ) {
        console.log("Respond Candidate " + message);
        console.log(message)
        var candidate = new RTCIceCandidate(message);
        pc.addIceCandidate(candidate);
    } else if (message.type === 'bye' && isStarted) {
        handleRemoteHangup();
    } else {

    }

}
///////////


function getScreenStream(callback) {
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
    } else {
        getScreenId(function(error, sourceId, screen_constraints) {
            navigator.mediaDevices.getUserMedia(screen_constraints).then(function(screenStream) {
                callback(screenStream);
            });
        });
    }
}


function sendToServer(msg) {
    console.log('sending...!', msg);
    chatSocket.send(JSON.stringify({
        msg
    }));
}

// Get screen source 
function get_local_screen() {
    
    isInitiator = true;
    isStarted = false;

    getScreenStream(function(screenStream) {
        console.log('Adding local stream.');
        localStream = screenStream;
        localVideo.srcObject = screenStream;
        sendToServer({'info': 'Student media ready'});
    });
    // maybeStart();
}

function test_server() {
    sendToServer({'holy': pm});
    sendToServer({'info': pm});
}

// if (isInitiator) {
//     maybeStart();
// }

function maybeStart() {
    console.log('>>>>>>> maybeStart() ', isStarted, localStream, isChannelReady);
    if (!isStarted && typeof localStream !== 'undefined' ) {
        console.log('>>>>>> creating peer connection');
        createPeerConnection();
        pc.addStream(localStream);
        isStarted = true;
        console.log('isInitiator', isInitiator);
        if (isInitiator) {
            doCall();
        }

    }
}

function createPeerConnection() {
    try {
        
        pc.onicecandidate = handleIceCandidate;
        pc.onaddstream = handleRemoteStreamAdded;
        pc.onremovestream = handleRemoteStreamRemoved;
        console.log('Created RTCPeerConnection');
    } catch(e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        alert('Cannot create RTCPeerConnection object.');
        return;
    }
}

function handleRemoteStreamRemoved(event) {
  console.log('Remote stream removed. Event: ', event);
}

function handleIceCandidate(event) {
    if (event.candidate) {
        console.log('icecandidate event: ', event);
        sendToServer({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
            client: window.user
        });
    }
}

function handleRemoteStreamAdded(event) {
    console.log('Remote stream added.');
    remoteStream = event.stream;
    remoteVideo.srcObject = remoteStream;
}

function doCall() {
    console.log('Sending offer to peer');
    pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
}

function setLocalAndSendMessage(sessionDescription) {
    pc.setLocalDescription(sessionDescription);
    console.log('setLocalAndSendMessage sending message', sessionDescription);
    sendToServer(sessionDescription);
}

function handleCreateOfferError(event) {
  console.log('createOffer() error: ', event);
}

function doAnswer() {
    console.log('Sending answer to peer');
    pc.createAnswer().then(
        setLocalAndSendMessage,
        onCreateSessionDescriptionError
    );
}

function onCreateSessionDescriptionError(error) {
    trace('Failed to create session description: ' + error.toString());
}

function receiveOffer() {
    console.log('>>>>>> creating peer connection');
    isInitiator = true;
    createPeerConnection();
    isStarted = true;
}

sendButton.addEventListener('click', test_server);
getscreenButton.addEventListener('click', get_local_screen);
callButton.addEventListener('click', maybeStart);
