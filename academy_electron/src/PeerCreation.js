import Peer from 'simple-peer';

class PeerCreation {

    peer = null;
    initialized = false;
    
    init = (stream, initiator) => {
        this.initialized = true;

        this.peer = new Peer({
            initiator: initiator,
            stream: stream, 
            trickle: false, 
            reconnectTimer: 1000,
            iceTransportPolicy: 'relay',
            config: {
                iceServers: [
                    {
                        "urls": "stun:121.167.151.232:3478",
                        "username": "tonysacademy",
                        "credential": "yZ4d4eM3Cq"
                    }, 
                    {
                        "urls": "turn:121.167.151.232:3478",
                        "username": "tonysacademy",
                        "credential": "yZ4d4eM3Cq"
                    }
                ]
            }
        });
        return this.peer;
    }

    connect = (otherId) => {
        this.peer.signal(otherId);
    }

    destroy = () => {
        this.initialized = false;
        this.peer.destroy();
    }
}

export default PeerCreation;