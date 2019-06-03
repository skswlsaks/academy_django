// docker run -p 6379:6379 -d redis

'use strict';

var isInitiator;
// var robot = require('robotjs');


window.room = prompt("Enter room name:");
window.user = prompt("User?");

// auth -> (Teacher or Student) => (true => student) and (false => teacher)
var auth = false;
console.log('pppp: is ', ppppp);
var ppppp = 'ws://' + window.location.host + '/ws/signaling/' + window.room + '/';
console.log('pppp: is ', ppppp);

var chatSocket = new WebSocket(ppppp);

var pm = 'Hi there!';
const sendButton = document.getElementById('send');
const getscreenButton = document.getElementById('get_screen');
const callButton = document.getElementById('call');
const sendDataButton = document.getElementById('sendData');
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
var sendChannel;
var receiveChannel;



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
    } else if (message.type === 'offer' && window.user === 'r') {
        console.log('Offer received!')
        if (!isInitiator && !isStarted) {
            receiveOffer();
        }
        pc.setRemoteDescription(new RTCSessionDescription(message));
        doAnswer();
    } else if (message.type === 'answer' && window.user === 's') {
        console.log('Got Answered!')
        pc.setRemoteDescription(new RTCSessionDescription(message));
        
        // && window.user !== message.client
        // window.user === 'r'
        // window.user === 's'
    } else if (message.type === 'candidate' && window.user === message.client) {
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

// Get screen Capturing 
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

// Emit message to server socket
function sendToServer(msg) {
    msg = JSON.stringify({msg});
    msg = JSON.parse(msg)['msg'];
    if (window.user === 'r') {
        msg.client = 's';
    } else {
        msg.client = 'r';
    }
    console.log('sending...!', msg);
    msg = JSON.stringify({msg});
    chatSocket.send(msg);
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
    // add_sound_track();
    maybeStart();
}

function add_sound_track() {
    console.log("sound_tracking");
    navigator.mediaDevices.getUserMedia({video:false, audio: true}).
        then(
        function (stream) {
            const audioTracks = stream.getTracks();
            console.log("Hey there tracking ");
            if (audioTracks.length > 0) {
                console.log("Using audio device...");
            }
            localStream.addTrack(audioTracks[0]);
            localVideo.srcObject = null;
            localVideo.srcObject = localStream;
            // window.AudioContext = window.AudioContext || window.webkitAudioContext;
            // var audioContext = new AudioContext();

            // // Create an AudioNode from the stream
            // var mediaStreamSource = audioContext.createMediaStreamSource(stream);

            // // Connect it to destination to hear yourself
            // // or any other node for processing!
            // mediaStreamSource.connect(audioContext.destination);
        }
    ).catch(function (err) {
        console.log(err);
    })
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
        // localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
        isStarted = true;
        console.log('isInitiator', isInitiator);
        if (isInitiator) {
            doCall();
        }

    }
}

function createPeerConnection() {
    try {        
        console.log('Created RTCPeerConnection');
        pc.onicecandidate = handleIceCandidate;
        pc.onaddstream = handleRemoteStreamAdded;
        pc.onremovestream = handleRemoteStreamRemoved;

        // Activating data channel 
        sendChannel = pc.createDataChannel('sendDataChannel', null);
        trace('Created send data channel');
        sendChannel.onopen = onSendChannelStateChange;
        sendChannel.onclose = onSendChannelStateChange;
        pc.ondatachannel = receiveChannelCallback;
    } catch(e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        alert('Cannot create RTCPeerConnection object.');
        return;
    }
}

function onSendChannelStateChange() {
    var readyState = sendChannel.readyState;
    trace('Send channel state is: ' + readyState);
}

function receiveChannelCallback(event) {
    trace('Receive Channel Callback');
    receiveChannel = event.channel;
    receiveChannel.onmessage = onReceiveMessageCallback;
    receiveChannel.onopen = onReceiveChannelStateChange;
    receiveChannel.onclose = onReceiveChannelStateChange;
}

function onReceiveChannelStateChange() {
    var readyState = receiveChannel.readyState;
    trace('Receive channel state is: ' + readyState);
}

function onReceiveMessageCallback(event) {
    trace('Received Message');
    console.log('Message from Data Channel: ' + event.data);
}

function sendData() {
    var data = 'datachannel is working!';
    sendChannel.send(data);
    trace('Sent Data: ' + data);
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
    console.log(sessionDescription);
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

function trace(text) {
    if (text[text.length - 1] === '\n') {
        text = text.substring(0, text.length - 1);
    }
    if (window.performance) {
        var now = (window.performance.now() / 1000).toFixed(3);
        console.log(now + ': ' + text);
    } else {
        console.log(text);
    }
}

function readMouseMove(e) {
    var result_x = document.getElementById('x_cor');
    var result_y = document.getElementById('y_cor');
    result_x.innerHTML = e.clientX;
    result_y.innerHTML = e.clientY;
}

localVideo.onmousemove = readMouseMove;

sendButton.addEventListener('click', test_server);
getscreenButton.addEventListener('click', get_local_screen);
callButton.addEventListener('click', maybeStart);
sendDataButton.addEventListener('click', sendData);