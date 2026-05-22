const express = require('express');
const router = express.Router();
const paymentController = require('../controller/PaymentController');

router.post('/addPayment', paymentController.addPayment);
router.get('/all', paymentController.getPayments);

module.exports = router;
