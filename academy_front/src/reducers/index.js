import { UPDATE_PEER } from '../actions/index';

const peer_initial_state = {
    peers: {},
    remote_peer: {},
    remote_video: {},
    my_peer: {}
}

const peer_manager = (state=peer_initial_state, action) => {
    switch(action.type) {
        case UPDATE_PEER:
            return state.peers = action.peers;
        default:
            return state
    }
};

export default peer_manager;