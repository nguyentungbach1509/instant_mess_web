import { LOGIN } from "./login_action_type";

const initialState = {
    user: null
}

const login_reducers = (state=initialState, action) => {
    switch(action.type) {
        case LOGIN:
            return {
                ...state,
                user: action.payload
            }
        default:
            return state;
    }
}

export default login_reducers;