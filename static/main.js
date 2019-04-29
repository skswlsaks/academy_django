'use strict';

var isInitiator;

window.room = prompt("Enter room name:");

// auth -> (Teacher or Student) => (true => student) and (false => teacher)
var auth = false;
var chatSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/signaling/' + window.room + '/');

var pm = 'Hi there!';
const sendButton = document.getElementById('send');
const getscreenButton = document.getElementById('get_screen');
var localVideo = document.querySelector('#localVideo');
var localStream;
var isInitiator = false;
var isStarted = false;
var isChannelReady = false;
var pc;


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
    getScreenStream(function(screenStream) {
        console.log('Adding local stream.');
        localStream = screenStream;
        localVideo.srcObject = screenStream;
        sendToServer({'info': 'Student media ready'});
    });
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
    if (!isStarted && typeof localStream !== 'undefined' && isChannelReady) {
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
        pc = new RTCPeerConnection(null);
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

function handleIceCandidate(event) {
    if (event.candidate) {
        console.log('icecandidate event: ', event);
        sendToServer({
            type: 'new-ice-candidate',
            message: "",
            candidate: event.candidate
        });
    }
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

sendButton.addEventListener('click', test_server);
getscreenButton.addEventListener('click', get_local_screen);
