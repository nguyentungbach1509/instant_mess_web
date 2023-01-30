const {Room} = require("../db");

//Render room code
const characters = Array.from(Array(36)).map((e, i) => i < 10 ? i + "" : i-10+65);
const code = characters.map((e, i) => i >= 10 ? String.fromCharCode(e) : e);


function room_code_render() {
    let room_code_string = "";
    for(let i = 0; i < 5; i++){
        room_code_string += code[Math.floor(Math.random() * (code.length-1))];
    }

    return room_code_string;
}

module.exports = {
    rooms: async (req, res) => {
        const list_rooms = await Room.find({members:{$elemMatch: {_id: req.body.userid}}}).exec();
        res.send(list_rooms);
    },
    createRoom:  async(req,res) => {
        let roomCode = room_code_render();
        while((await Room.find({room_code: roomCode}).exec()).length !== 0) {
            roomCode = room_code_render();
        }
    
        Room.create({
            room_name: req.body.room_name,
            room_code: roomCode,
            members: [req.body.user]
        }, (err, room) => {
            if(err) {
                res.send(err);
            }
            else {
                res.send("success");
            }
        });
    },

    joinRoom: async (req, res) => {
        const findroom = await Room.find({room_code: req.body.room_code}).exec();
        console.log(findroom);
        if(findroom.length !== 0) {
            if(findroom[0].members.some(member => member._id === req.body.user._id)) {
                res.send({mess: "You are already in the room!"});
            }
            else {
                await Room.updateOne({"_id": findroom[0]._id}, {"$push": {members: req.body.user}});
                res.send({mess: ""});
            }
        }
        else {
            res.send({mess: "The room doenst exist"});
        }
    }
}