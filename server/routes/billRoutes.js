const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

// Route to get all bills for a specific user
router.get('/:userEmail', billController.getAllBills);
router.patch('/:billId', billController.updateBillPaidStatus);
module.exports = router;
