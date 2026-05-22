const mongoose = require('mongoose');
const { Schema } = mongoose;

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  industry: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    // required: true
  },
  description: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  website: {
    type: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  logo: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
    isBlocked: {
    type: Boolean,
    default: false, // ✅ New field for block/unblock functionality
  }
});

module.exports = mongoose.model('Company', companySchema);
