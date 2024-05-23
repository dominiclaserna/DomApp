// laserna/server/controllers/billController.js

const Bill = require('../models/Bill');
const Notification = require('../models/Notification'); // Import the Notification model

// Controller function to create a new bill
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
            about: 'an unpaid/overdue bill',
            seen: false // Initially set as unseen
        });
        console.log('Notification created:', newNotification); // Log the newly created notification

        res.status(201).json({ message: 'Bill created successfully', bill });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, manager, createdAt } = req.body;
    const newAnnouncement = new Announcement({ title, message, manager, createdAt });
    await newAnnouncement.save();

    // Create a notification message for the receiver
    const notificationMessage = new Message({
      sender: manager,
      receiver: manager, // Assuming the receiver is the manager; adjust as needed
      subject: 'New Announcement Created',
      body: `A new announcement titled "${title}" has been created.`
    });
    await notificationMessage.save();

    res.status(201).json({ message: 'Announcement created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getBillsForUser = async (req, res) => {
    try {
        const userEmail = req.params.userEmail;
        const bills = await Bill.find({
            $or: [{ receiver: userEmail }, { biller: userEmail }]
        });
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bills' });
    }
};
exports.updateBillPaidStatus = async (req, res) => {
    const { billId } = req.params;
    const { paid, paymentRefNumber } = req.body; // Ensure paymentRefNumber is correctly extracted from the request body

    try {
        // Update the bill's paid status in the database
        const updatedBill = await Bill.findByIdAndUpdate(billId, { paid, paymentRefNumber }, { new: true });
        const newNotification = await Notification.create({
            notificationOwner: updatedBill.biller,
            about: 'an updated bill',
            seen: false // Initially set as unseen
        });

        console.log('Notification created:', newNotification); // Log the newly created notification
        res.status(200).json(updatedBill);
        if (!updatedBill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        // Create a notification for the biller

    } catch (error) {
        console.error('Error updating bill and creating notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};