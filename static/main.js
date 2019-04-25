'use strict';

// On this codelab, you will be streaming only video (video: true).
const mediaStreamConstraints = {
  video: true,
  audio: true,
};

// Video element where stream will be placed.
const localVideo = document.querySelector('video');

// Local stream that will be reproduced on the video.
let localStream;

// Handles success by adding the MediaStream to the video element.
// function gotLocalMediaStream(mediaStream) {
//   localStream = mediaStream;
//   localVideo.srcObject = mediaStream;
// }



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

getScreenStream(function(screenStream) {
	localStream = screenStream;
    localVideo.srcObject = screenStream;
});

// Handles error by logging a message to the console with the error message.
function handleLocalMediaStreamError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

// Initializes media stream.
// navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
//   .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
