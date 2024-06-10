const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.get('/user/:userEmail', billController.getBillsForUser);
router.get('/', billController.getAllBills);
router.post('/', billController.createBill);
router.patch('/:billId', billController.updateBillPaidStatus);
router.get('/unique-receivers', billController.getUniqueReceivers);

module.exports = router;
