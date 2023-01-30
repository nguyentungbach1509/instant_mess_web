const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type:String,
        require: true
    },
    status: {
        type: Boolean,
        required: true
    }
});

const RoomSchema = mongoose.Schema({
    room_name: {
        type:String,
        required:true
    },
    room_code: {
        type: String,
        required: true
    },
    members: {
        type: Array,
    }
});

const MessSchema = mongoose.Schema({
    room_code: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    text: {
        type: String
    },
    img: {
        type: String
    },
    voice: {
        type: String
    }
});

const Mess = mongoose.model("Mess", MessSchema);
const User = mongoose.model("User", UserSchema);
const Room = mongoose.model("Room", RoomSchema);

module.exports = {
    Mess: Mess,
    User: User,
    Room: Room
};
