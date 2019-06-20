import { combineReducers } from 'redux';
import peer_manager from './peer_manager';
import auth from './auth';
import errors from './errors';

export default combineReducers({
    peer_manager,
    auth,
    errors
})