import { UPDATE_ONLINE_USERS, UPDATE_MY_PEER, UPDATE_LOCALSTREAM, UPDATE_SOCKET } from './types';

export const update_online_users = (online_users) => {
    return {
        type: UPDATE_ONLINE_USERS,
        online_users
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