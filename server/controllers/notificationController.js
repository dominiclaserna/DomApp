// laserna/server/controllers/notificationController.js

const Notification = require('../models/Notification');

// Controller function to get notifications for a specific user based on their email
exports.getNotificationsForUser = async (req, res) => {
    try {
        const userEmail = req.params.email; // Access the user's email from request parameters
        const notifications = await Notification.find({ notificationOwner: userEmail });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};


// Controller function to update the seen status of a specific notification by ID
exports.updateNotificationSeenStatus = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const updatedNotification = await Notification.findByIdAndUpdate(notificationId, { seen: true }, { new: true });
        if (!updatedNotification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.status(200).json(updatedNotification);
    } catch (error) {
        console.error('Error updating notification seen status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
