export const get_user_media = (constraints) => {
    if (navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices.getUserMedia(constraints);
    } else if (navigator.getUserMedia) {
        return navigator.getUserMedia(constraints);
    } else if(navigator.webkitGetUserMedia) {
        return navigator.getUserMedia(constraints);
    } else{
        return null;
    }
}

export const get_display_media = (constraints) => {
    if (navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices.getDisplayMedia(constraints);
    } else if (navigator.getUserMedia) {
        return navigator.getDisplayMedia(constraints);
    } else if(navigator.webkitGetUserMedia) {
        return navigator.getDisplayMedia(constraints);
    } else{
        return null;
    }
}