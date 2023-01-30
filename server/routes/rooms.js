const express = require('express');
const routers = express.Router();
const RoomController = require('../controller/RoomController');

routers.post('/createroom', RoomController.createRoom);
routers.post('/rooms', RoomController.rooms);
routers.post('/joinroom', RoomController.joinRoom);

module.exports = routers;