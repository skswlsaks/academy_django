import { LOGIN_SUCCESS, LOGIN_FAILURE, REGISTER_SUCCESS, REGISTER_FAILURE, LOGOUT_SUCCESS, USER_LOADING, USER_LOADED, AUTH_ERROR } from "./types";
import { return_errors } from "./errors";
import { ApiService } from '../ApiService';
import { authHeader } from '../helpers/authHeader';

const apiService = new ApiService();

export const getUser = () => (dispatch, getState) => {
    dispatch({ type: USER_LOADING });
    apiService.getUser(authHeader(getState)).then(res => {
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    }).catch(err => {
        dispatch(return_errors(err.response.data, err.response.status));
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
        dispatch(return_errors(err.response.data, err.response.status));
        dispatch({ type: LOGIN_FAILURE });
    });
};

export const logout = () => (dispatch, getState) => {
    apiService.logout(authHeader(getState)).then(res => {
        dispatch({ type: LOGOUT_SUCCESS });
    }).catch(err => {
        dispatch(return_errors(err.response.data, err.response.status));
    });
};

export const register = (formData) => dispatch => {
    apiService.register(formData).then(res => {
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(return_errors(err.response.data, err.response.status));
        dispatch({ type: REGISTER_FAILURE });
    });
};