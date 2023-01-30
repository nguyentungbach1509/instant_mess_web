import { legacy_createStore as createStore } from "redux";
import root_reducers from "./root_reducers";


const store = createStore(root_reducers);

export default store;