import { LOGIN } from "./login_action_type";

export const login_action_creator = user => {
    return {
        type: LOGIN,
        payload: user
    }
}