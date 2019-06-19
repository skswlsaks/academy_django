import * as actions from '../actions';
import { defaults } from 'lodash.defaults';

const peer_initial_state = {
    peers: {},
    local_video: {},
    remote_peer: {},
    remote_video: {},
    my_peer: {},
    socket: {}
}

const peer_manager = (state=peer_initial_state, action) => {
    switch(action.type) {
        case actions.UPDATE_PEER:
            var new_state = {
                ...state,
                peers: action.peer
            }
            return new_state;

        case actions.UPDATE_MY_PEER:
            var new_state = {
                ...state,
                my_peer: action.my_peer,
                peercreation: action.peercreation
            }
            return new_state;

        case actions.UPDATE_LOCALSTREAM:
            var new_state = {
                ...state,
                local_video: action.stream
            }
            return new_state;
        case actions.UPDATE_SOCKET:
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