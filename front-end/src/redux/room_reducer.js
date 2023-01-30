import { ROOM_CONFIG } from "./room_action_type";

const initialState = {
    rooms: []
};

const room_reducers = (state=initialState, action) => {
    switch(action.type) {
        case ROOM_CONFIG:
            return {
                ...state,
                rooms: action.payload,
            };
        default:
            return state;
    }
};

export default room_reducers;

