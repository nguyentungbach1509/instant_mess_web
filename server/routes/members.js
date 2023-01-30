const express = require('express');
const routers = express.Router();
const MemberController = require('../controller/MemberController');

routers.post('/', MemberController.members);

module.exports = routers;