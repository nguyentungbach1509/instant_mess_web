import { ROOM_CONFIG } from "./room_action_type";

export const room_config_action_creator = rooms => {
    return {
        type: ROOM_CONFIG,
        payload: rooms
    }
}