const Message = require('../models/Message');
// laserna/server/controllers/billController.js
const Notification = require('../models/Notification'); // Import the Notification model



// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { sender, receiver, subject, body } = req.body;
    const newMessage = new Message({ sender, receiver, subject, body });
    await newMessage.save();
            // Create a notification for the new bill
            const newNotification = await Notification.create({
              notificationOwner: receiver, // Assuming the receiver is the one who should see the notification
              about: 'a new message',
              seen: false // Initially set as unseen
          });
          console.log('Notification created:', newNotification); // Log the newly created notification
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create message' });
  }
};



// Get messages for a user with optional receiver filter
exports.getMessagesForUser = async (req, res) => {
  try {
    const email = req.params.email;
    const { filter } = req.query;

    let filterQuery = {}; // Initialize an empty filter query object

    // If a filter is provided, include it in the filter query
    if (filter) {
      filterQuery = { receiver: filter };
    }

    // Query messages based on the user email and the filter query
    const messages = await Message.find({
      $and: [
        { $or: [{ sender: email }, { receiver: email }] }, // Query by user email
        filterQuery // Apply additional filter if provided
      ]
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};



exports.getUniqueReceivers = async (req, res) => {
    try {
        const uniqueReceivers = await Message.distinct('receiver');
        res.status(200).json(uniqueReceivers);
    } catch (error) {
        console.error('Error fetching unique receivers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
