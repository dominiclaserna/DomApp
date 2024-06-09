const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    receiver: { type: String, required: true },
    biller: { type: String, required: true },
    paid: { type: Boolean, default: false },
    paymentRefNumber: { type: String, default: null },
    category: { type: String, required: true },
    paymentProof: { type: Buffer, default: null }, // Adjusted to accept null as default
    datePaid: { type: Date, default: null }, // Added datePaid field
    modeOfPayment: { type: String, default: null } // Added datePaid field
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
