import { SIDEBAR_VISIBILITY_TOGGLE } from '../actions/types';

const initialState = {
    isOpen: true
};

const sidebar = (state = initialState, action) => {
    switch (action.type) {
        case SIDEBAR_VISIBILITY_TOGGLE:
            return {
                isOpen: !state.isOpen
            };
        default:
            return state;
    }
}

export default sidebar;