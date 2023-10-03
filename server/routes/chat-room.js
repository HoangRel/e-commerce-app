const express = require('express');
const chatboxControllers = require('../controllers/chat-room');
const { isAuth } = require('../utils/is-auth');

const router = express.Router();

router.post('/message', isAuth, chatboxControllers.postMessage);

module.exports = router;
