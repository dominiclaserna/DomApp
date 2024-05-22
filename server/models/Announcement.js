// Announcement.js
const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    manager: {
        type: String,
        required: true // Assuming manager's email is stored as a string
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
