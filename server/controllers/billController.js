const Bill = require('../models/Bill');
const Notification = require('../models/Notification');
const Announcement = require('../models/Announcement');
const Message = require('../models/Message'); // Import the Message model

// Controller function to create a new bill
exports.createBill = async (req, res) => {
    try {
        console.log('Request Payload:', req.body);
        const { dueDate, amount, receiver, biller, paymentRefNumber, category } = req.body;

        const bill = new Bill({ dueDate, amount, receiver, biller, paymentRefNumber, category });
        console.log('Bill before saving:', bill);
        await bill.save();

        // Create a notification for the new bill
        const newNotification = await Notification.create({
            notificationOwner: receiver,
            about: 'an unpaid/overdue bill',
            seen: false
        });
        console.log('Notification created:', newNotification);

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

        const notificationMessage = new Message({
            sender: manager,
            receiver: manager,
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

// Controller function to get all bills
exports.getAllBills = async (req, res) => {
    try {
        const bills = await Bill.find();
        res.json(bills);
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller function to get bills for a user with optional filter
exports.getBillsForUser = async (req, res) => {
    try {
        const { userEmail } = req.params;
        const { filter } = req.query;

        let filterQuery = {};
        if (filter) {
            filterQuery.receiver = filter;
        }

        const bills = await Bill.find({
            $or: [{ receiver: userEmail }, { biller: userEmail }],
            ...filterQuery
        });

        res.status(200).json(bills);
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).json({ error: 'Failed to fetch bills' });
    }
};

// Controller function to update bill payment status
exports.updateBillPaidStatus = async (req, res) => {
    const { billId } = req.params;
    const { paid, paymentRefNumber, modeOfPayment } = req.body;

    try {
        const datePaid = new Date();
        const updatedBill = await Bill.findByIdAndUpdate(
            billId,
            { paid, paymentRefNumber, modeOfPayment, datePaid },
            { new: true }
        );

        if (!updatedBill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        const newNotification = await Notification.create({
            notificationOwner: updatedBill.biller,
            about: 'an updated bill',
            seen: false
        });

        console.log('Notification created:', newNotification);
        res.status(200).json(updatedBill);
    } catch (error) {
        console.error('Error updating bill and creating notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller function to get unique receivers
exports.getUniqueReceivers = async (req, res) => {
    try {
        const uniqueReceivers = await Bill.distinct('receiver');
        console.log('Unique receivers:', uniqueReceivers);
        res.status(200).json(uniqueReceivers);
    } catch (error) {
        console.error('Error fetching unique receivers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
