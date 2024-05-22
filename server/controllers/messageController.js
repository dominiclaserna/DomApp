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
exports.createBill = async (req, res) => {
  try {
      console.log('Request Payload:', req.body); // Log the request payload
      const { dueDate, amount, receiver, biller, paymentRefNumber, category } = req.body;
      const bill = new Bill({ dueDate, amount, receiver, biller, paymentRefNumber, category });
      console.log('Bill before saving:', bill); // Log the bill object before saving
      await bill.save();

      // Create a notification for the new bill
      const newNotification = await Notification.create({
          notificationOwner: receiver, // Assuming the receiver is the one who should see the notification
          about: 'unpaid/overdue bill',
          seen: false // Initially set as unseen
      });
      console.log('Notification created:', newNotification); // Log the newly created notification

      res.status(201).json({ message: 'Bill created successfully', bill });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};



// Get messages for a user
exports.getMessagesForUser = async (req, res) => {
  try {
    const email = req.params.email;
    const messages = await Message.find({
      $or: [{ sender: email }, { receiver: email }]
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
