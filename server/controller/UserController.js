const {User} = require("../db");
const {Room} = require("../db");
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = {
    get: (req, res) => {
        res.send(req.session.user);
        
    },
    login: async (req,res) => {
        const results = await User.find({name: (req.body.name).toLowerCase()}).exec();
        if(results.length === 0) {
            res.send({alert:"Username not found!", type:0});
        }
        else {
            if(bcrypt.compareSync(req.body.password,results[0].password)) {
                req.session.user = results[0];
                await User.updateOne({name: ((req.body.name).toLowerCase())}, {status: true});
                await Room.updateMany({members:{$elemMatch: {name: (req.body.name).toLowerCase()}}, 
                "members.name": (req.body.name).toLowerCase()}, {$set:{"members.$.status": true}});
                res.send(results[0]);
            }
            else {
                res.send({alert:"Password has problem!", type:0});
            }
        }
    },

    signup: async (req, res) => {
        const results = await User.find({name: (req.body.name).toLowerCase()}).exec();
        if(results.length === 0) {
            const hashPassword = bcrypt.hashSync(req.body.password, saltRounds);
            User.create({
                name:(req.body.name).toLowerCase(),
                password: hashPassword,
                status: false
            }, (err, user) => {
                if(err) {
                    res.send(err);
                }
                else {
                    res.send({alert: "Now you can login to your account!", type:1});
                }
            });
        }
        else {
            res.send({alert:"User Name has been used!", type:0});
        }
    },

    logout: async (req,res) => {
        const user = await User.findOneAndUpdate({_id:req.body.user._id}, {status: false}, {new: true});
        await Room.updateMany({members:{$elemMatch: {name: (req.body.user.name).toLowerCase()}}, "members.name": (req.body.user.name).toLowerCase()}, {$set:{"members.$.status": false}});
        console.log(user);
        req.session.destroy();
        res.send(user);
    }

}