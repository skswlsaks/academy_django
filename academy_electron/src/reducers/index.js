import { combineReducers } from 'redux';
import peer_manager from './peer_manager';
import auth from './auth';
import alert from './alert';

export default combineReducers({
    peer_manager,
    auth,
    alert
})