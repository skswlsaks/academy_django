import { RETURN_ERRORS, CLEAR_ERRORS } from "../actions/types";

const initialState = {
    msg: {},
    status: null
};

const errors = (state = initialState, action) => {
    switch (action.type) {
        case RETURN_ERRORS:
            return {
                msg: action.payload.msg,
                status: action.payload.status
            };
        case CLEAR_ERRORS:
            return {
                msg: {},
                status: null
            };
        default:
            return state;
    }
}

export default errors;