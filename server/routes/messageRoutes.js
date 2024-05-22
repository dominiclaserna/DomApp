const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Create a new message
router.post('/', messageController.createMessage);

// Get messages for a user
router.get('/user/:email', messageController.getMessagesForUser);

module.exports = router;
