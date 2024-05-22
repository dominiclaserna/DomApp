// laserna/server/routes/billRoutes.js
const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

// Route to get all bills
router.get('/', billController.getAllBills);
router.patch('/:billId', billController.updateBillPaidStatus);
module.exports = router;
