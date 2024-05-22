const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

// Route for creating an announcement
router.post('/', announcementController.createAnnouncement);

// Route for fetching all announcements
router.get('/', announcementController.getAllAnnouncements);

module.exports = router;
