import Peer from 'simple-peer';

class PeerCreation {

    peer = null;
    init = (stream, initiator) => {
        this.peer = new Peer({
            initiator: initiator,
            stream: stream, 
            trickle: false, 
            reconnectTimer: 1000,
            iceTransportPolicy: 'relay',
            config: {
                iceServer: [{
                    urls: 'stun:stun.l.google.com:19302'
                }]
            }
        })
    }
}