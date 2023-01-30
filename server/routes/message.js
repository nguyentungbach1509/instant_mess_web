const express = require('express');
const router = express.Router();
const MessageController = require('../controller/MessesageController');

router.post('/', MessageController.mess);

module.exports = router;