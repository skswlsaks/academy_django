import { RETURN_ERRORS, CLEAR_ERRORS } from "./types";

// RETURN ERRORS
export const return_errors = (msg, status) => {
    return {
        type: RETURN_ERRORS,
        payload: { msg, status }
    };
};

// RETURN ERRORS
export const clear_errors = () => {
    return {
        type: CLEAR_ERRORS
    };
};