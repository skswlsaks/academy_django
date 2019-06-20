import { UPDATE_PEER, DELETE_PEER, UPDATE_MY_PEER, UPDATE_LOCALSTREAM, UPDATE_SOCKET } from '../actions/types';

const initialState = {
    peers: {},
    local_video: {},
    remote_peer: {},
    remote_video: {},
    my_peer: {},
    socket: {}
}

const peer_manager = (state=initialState, action) => {
    switch(action.type) {
        case UPDATE_PEER:
            var new_state = {
                ...state,
                peers: action.peer
            }
            return new_state;

        case UPDATE_MY_PEER:
            var new_state = {
                ...state,
                my_peer: action.my_peer,
                peercreation: action.peercreation
            }
            return new_state;

        case UPDATE_LOCALSTREAM:
            var new_state = {
                ...state,
                local_video: action.stream
            }
            return new_state;
        case UPDATE_SOCKET:
            var new_state = {
                ...state,
                socket: action.socket
            }
            return new_state;
        default:
            return state;
    }
};

export default peer_manager;