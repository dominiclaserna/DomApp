// server/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Route to fetch notifications for a specific user based on their email
router.get('/user/:email', notificationController.getNotificationsForUser);

// Route to update notifications
router.patch('/:notificationId', notificationController.updateNotificationSeenStatus);

module.exports = router;
