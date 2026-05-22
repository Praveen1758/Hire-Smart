

// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//   ApplicationId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Application', // Reference to the Booking model
//     required: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Reference to the Package model
//     required: true,
//   },
//   JobId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'JobPosting', // Reference to the Package model
//     required: true,
//   },

//   transactionId: {
//     type: String,
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['Pending', 'Paid', 'Failed'],
//     default: 'Paid',
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('Payment', paymentSchema);


const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company', // Reference to the Package model
    required: true,
  },

  transactionId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Paid',
  },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
