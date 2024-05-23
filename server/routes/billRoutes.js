// laserna/server/routes/billRoutes.js
const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

// Route to get bills for a specific user
router.get('/user/:userEmail', billController.getBillsForUser);
router.get('/', billController.getAllBills);
router.patch('/:billId', billController.updateBillPaidStatus);
module.exports = router;
