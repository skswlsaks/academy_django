import { UPDATE_PEER, DELETE_PEER, UPDATE_MY_PEER, UPDATE_LOCALSTREAM, UPDATE_SOCKET } from './types';

export const update_peer = (peer) => {
    return {
        type: UPDATE_PEER,
        peer
    };
}
export const delete_peer = (peer) => {
    return {
        type: DELETE_PEER,
        peer
    };
}

export const update_my_peer = (my_peer, peercreation) => {
    return {
        type: UPDATE_MY_PEER,
        my_peer,
        peercreation
    };
}

export const update_localstream = (stream) => {
    return {
        type: UPDATE_LOCALSTREAM,
        stream
    };
}

export const update_socket = (socket) => {
    return {
        type: UPDATE_SOCKET,
        socket
    };
}