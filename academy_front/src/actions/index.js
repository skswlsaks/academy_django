export const UPDATE_PEER = 'UPDATE_PEER';
export const DEL_PEER = 'DEL_PEER';
// export const SET_DIFF = 'SET_DIFF';

export function update_peer(updated_peer) {
    return {
        type: UPDATE_PEER,
        peer: updated_peer
    };
}

export function del_peer(del_peer) {
    return {
        type: DEL_PEER,
        peer: del_peer
    };
}
