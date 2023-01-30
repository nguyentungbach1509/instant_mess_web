import { combineReducers } from "redux";
import login_reducers from "./login_reducer";
import room_reducers from "./room_reducer";

const root_reducers = combineReducers({
    login_reducers: login_reducers,
    room_reducers: room_reducers
});

export default root_reducers;