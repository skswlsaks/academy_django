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
                iceServer: [
                    {
                        "urls": "stun:numb.viagenie.ca",
                        "username": "tonysacademy@hotmail.com",
                        "credential": "tonysacademy"
                    }, 
                    {
                        "urls": "turn:numb.viagenie.ca",
                        "username": "tonysacademy@hotmail.com",
                        "credential": "tonysacademy"
                    }
                ]
            }
        });
        return this.peer;
    }

    connect = (otherId) => {
        this.peer.signal(otherId)
    }

    destroy = () => {
        this.initialized = false;
        this.peer.destroy();
    }
}

export default PeerCreation;