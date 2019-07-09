import { combineReducers } from 'redux';
import peer_manager from './peer_manager';
import auth from './auth';
import alert from './alert';
import sidebar from './sidebar';
import { reducer as toastr } from "react-redux-toastr";

export default combineReducers({
    peer_manager,
    auth,
    alert,
    sidebar,
    toastr
})