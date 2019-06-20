import React from 'react';
import { Alert } from 'react-bootstrap';

export const errorAlert = (errors) => {
    var firstError = null;
    if (errors.status) {
        const key = Object.keys(errors.msg)[0];
        firstError = errors.msg[key];
    }
    return (
        <Alert className="mb-4" variant="danger">{firstError}</Alert>
    );
}