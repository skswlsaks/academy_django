import React from "react";
import { toastr } from "react-redux-toastr";

let options = {
    timeOut: 5000,
    showCloseButton: true,
    progressBar: false,
    position: "top-center"
};

export const showToast = (title, msg, type) => {
    const toastrInstance =
        type === "info" ? toastr.info : 
        type === "warning" ? toastr.warning : 
        type === "danger" ? toastr.error : toastr.success;

    return toastrInstance(title, msg, options);
}