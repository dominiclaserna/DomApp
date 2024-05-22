// Import necessary modules
const mongoose = require('mongoose');

// Define Notification schema
const notificationSchema = new mongoose.Schema({
  notificationOwner: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  seen: {
    type: Boolean,
    default: false
  }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt fields

// Create Notification model
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
