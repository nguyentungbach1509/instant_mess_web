const {Mess} = require('../db');

module.exports = {
    mess: async(req, res) => {
        const mess = await Mess.find({room_code: req.body.room_code}).exec();
        res.send(mess);
    }
}