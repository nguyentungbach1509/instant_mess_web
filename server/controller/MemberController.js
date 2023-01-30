const {Room} = require('../db');

module.exports = {
    members: async(req, res) => {
        const room = await Room.find({_id: req.body.roomid}).exec();
        res.send(room[0].members);
    }
}