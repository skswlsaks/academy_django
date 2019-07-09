import { SHOW_ALERT, HIDE_ALERT } from "../actions/types";

const initialState = {
    show: false,
    msg: null,
    type: null
};

const alert = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_ALERT:
            return {
                show: true,
                msg: action.payload.msg,
                type: action.payload.type
            };
        case HIDE_ALERT:
            return {
                show: false,
                msg: null,
                type: null
            };
        default:
            return state;
    }
}

export default alert;