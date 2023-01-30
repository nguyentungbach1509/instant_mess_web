const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv/config');
const {Mess, Room} = require("./db");
const {User} = require("./db");
const session = require('express-session');
const userRouter = require('./routes/user');
const roomsRouter = require('./routes/rooms');
const membersRouter = require('./routes/members');
const messageRouter = require('./routes/message');



app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret:'secret session',
    resave: false,
    saveUninitialized: false
}));

//DB config
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
});

let typing_users = [];

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

io.on("connection", async (socket) => {
    socket.on("joinroom", async(data) => {
        socket.join(data.room_code);
        const room = await Room.find({room_code: data.room_code}).exec();
        io.in(data.room_code).emit("update_room_members", {members: room[0].members});
    });

    socket.on("status_change", async(data) => { 
       const rooms = await Room.find({members:{$elemMatch: {_id: data._id}}}).exec();
       io.emit("room_status_update", {rooms: rooms});
    });

    socket.on("mess_typing", (data) => {
        let index = typing_users.findIndex(e => e.room_code === data.room_code && e.name === data.name);
        if(index === -1){
            typing_users.push({room_code: data.room_code, name: data.name});
        }
        io.to(data.room_code).emit("typing", {typing_users: typing_users});
    })

    socket.on("send_mess", (data) => {
        let index = typing_users.findIndex(e => e.room_code === data.room_code && e.name === data.name);
        if(index !== -1) {
            typing_users.splice(index, 1);
        }
        Mess.create({
            room_code:data.room_code,
            name:data.name,
            text: data.text,
            img: data.img,
            voice:null
        }, async (err, mess) => {
            if(err) {
                console.log(err);
            }
            else {
                const messages = await Mess.find({room_code: data.room_code}).exec();
                io.in(data.room_code).emit("return_mess", {messages: messages, typing_users: typing_users});
            }
            
        });
    });
});



app.use('/user', userRouter);
app.use('/room', roomsRouter);
app.use('/members', membersRouter);
app.use('/mess', messageRouter);



const port = process.env.PORT || 3001;

server.listen(port, () => console.log("Listening on " + port + "..."));