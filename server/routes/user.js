const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const { User } = require('../db');

router.get('/', UserController.get);
router.post('/login', UserController.login);
router.post('/signup', UserController.signup);
router.post('/logout', UserController.logout);

module.exports = router;
