import { RESET_PEER_MANAGER, UPDATE_ONLINE_USERS, UPDATE_MY_PEER, UPDATE_LOCALSTREAM, UPDATE_SOCKET } from '../actions/types';

const initialState = {
    online_users: {},
    local_stream: {},
    remote_peer: {},
    remote_video: {},
    my_peer: {},
    socket: {}
}

const peer_manager = (state=initialState, action) => {
    switch(action.type) {
        case UPDATE_ONLINE_USERS:
            var new_state = {
                ...state,
                online_users: action.online_users
            }
            return new_state;

        case UPDATE_MY_PEER:
            var new_state = {
                ...state,
                my_peer: action.my_peer
            }
            return new_state;

        case UPDATE_LOCALSTREAM:
            var new_state = {
                ...state,
                local_stream: action.stream
            }
            return new_state;
        case UPDATE_SOCKET:
            var new_state = {
                ...state,
                socket: action.socket
            }
            return new_state;
        case RESET_PEER_MANAGER:
            var new_state = {
                online_users: {},
                local_stream: {},
                remote_peer: {},
                remote_video: {},
                my_peer: {},
                socket: {}
            }
            return new_state;
        default:
            return state;
    }
};

export default peer_manager;