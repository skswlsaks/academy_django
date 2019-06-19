export const UPDATE_PEER = 'UPDATE_PEER';
export const DEL_PEER = 'DEL_PEER';
export const UPDATE_MY_PEER = 'UPDATE_MY_PEER';
export const UPDATE_LOCALSTREAM = 'UPDATE_LOCAL_STREAM';
export const UPDATE_SOCKET = 'UPDATE_SOCKET';

// export const SET_DIFF = 'SET_DIFF';

export function update_peer(updated_peer) {
    return {
        type: UPDATE_PEER,
        peer: updated_peer
    };
}

export function update_my_peer(my_peer, peercreation) {
    return {
        type: UPDATE_MY_PEER,
        my_peer,
        peercreation
    };
}

export function update_localstream(stream) {
    return {
        type: UPDATE_LOCALSTREAM,
        stream
    };
}

export function del_peer(del_peer) {
    return {
        type: DEL_PEER,
        peer: del_peer
    };
}

export function update_socket(socket) {
    return {
        type: UPDATE_SOCKET,
        socket
    };
}
