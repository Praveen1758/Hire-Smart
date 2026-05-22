// controllers/paymentController.js
const Payment = require('../model/payment_model');

const addPayment = async (req, res) => {
  try {
    const { companyId, transactionId, amount } = req.body;

    if (!companyId || !transactionId || !amount) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newPayment = new Payment({
      companyId,
      transactionId,
      amount,
      paymentStatus: 'Paid',
    });

    const saved = await newPayment.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error in addPayment:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('companyId');
    res.status(200).json(payments);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addPayment,
  getPayments,
};
