import { SHOW_ALERT, HIDE_ALERT } from "./types";

// RETURN ERRORS
export const show_alert = (msg, type) => {
    return {
        type: SHOW_ALERT,
        payload: { msg, type }
    };
};

// RETURN ERRORS
export const hide_alert = () => {
    return {
        type: HIDE_ALERT
    };
};