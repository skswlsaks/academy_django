import { RESET_PEER_MANAGER, LOGIN_SUCCESS, LOGIN_FAILURE, REGISTER_SUCCESS, REGISTER_FAILURE, LOGOUT_SUCCESS, USER_LOADING, USER_LOADED, AUTH_ERROR } from "./types";
import { show_alert, hide_alert } from "./alert";
import { ApiService } from '../ApiService';
import { authHeader } from '../helpers/authHeader';
import { parseError } from '../helpers/errorParser';

const apiService = new ApiService();

export const getUser = () => (dispatch, getState) => {
    dispatch({ type: USER_LOADING });
    apiService.getUser(authHeader(getState)).then(res => {
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    }).catch(err => {
        if(err.response.status){
            const errorMessage = parseError(err.response.data);
            dispatch(show_alert(errorMessage, 'danger'));
            setTimeout(() => {
                dispatch(hide_alert());
            }, 3000);
        }
        dispatch({ type: AUTH_ERROR });
    });
};

export const login = (username, password) => dispatch => {
    const body = { username: username, password: password };
    apiService.login(body).then(res => {
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        if(err.response.status){
            const errorMessage = parseError(err.response.data);
            dispatch(show_alert(errorMessage, 'danger'));
            setTimeout(() => {
                dispatch(hide_alert());
            }, 3000);
        }
        dispatch({ type: LOGIN_FAILURE });
    });
};

export const logout = () => (dispatch, getState) => {
    var socket = getState().peer_manager.socket;
    socket.send(JSON.stringify({
        'logout': true
    }));
    apiService.logout(authHeader(getState)).then(res => {
        dispatch({ type: LOGOUT_SUCCESS });
        dispatch({ type: RESET_PEER_MANAGER });
    }).catch(err => {
        if(err.response.status){
            const errorMessage = parseError(err.response.data);
            dispatch(show_alert(errorMessage, 'danger'));
            setTimeout(() => {
                dispatch(hide_alert());
            }, 3000);
        }
    });
};

export const register = (formData) => dispatch => {
    apiService.register(formData).then(res => {
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        if(err.response.status){
            const errorMessage = parseError(err.response.data);
            dispatch(show_alert(errorMessage, 'danger'));
            setTimeout(() => {
                dispatch(hide_alert());
            }, 3000);
        }
        dispatch({ type: REGISTER_FAILURE });
    });
};