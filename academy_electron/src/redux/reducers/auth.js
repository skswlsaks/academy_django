import { REGISTER_SUCCESS, REGISTER_FAILURE, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS, USER_LOADING, USER_LOADED, AUTH_ERROR } from "../actions/types";
import history from "../../helpers/history";

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isLoading: false,
    user: null
};

const auth = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem("token", action.payload.token);
            if(action.payload.user.profile.isTeacher){
                history.push('/teacher/classroom');
            }else{
                history.push('/student/classroom');
            }
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true
            };
        case AUTH_ERROR:
        case REGISTER_FAILURE:
        case LOGIN_FAILURE:
        case LOGOUT_SUCCESS:
            localStorage.removeItem("token");
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };
        default:
            return state;
    }
}

export default auth;