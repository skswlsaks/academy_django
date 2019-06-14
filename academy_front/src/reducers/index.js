import { UPDATE_PEER } from '../actions/index';
import { defaults } from 'lodash.defaults';

const peer_initial_state = {
    peers: {},
    remote_peer: {},
    remote_video: {},
    my_peer: {}
}

const peer_manager = (state=peer_initial_state, action) => {
    switch(action.type) {
        case UPDATE_PEER:
            var temp = defaults({'peers': action.peer}, state);
            console.log(temp);
            return temp
        default:
            return state
    }
};

export default peer_manager;