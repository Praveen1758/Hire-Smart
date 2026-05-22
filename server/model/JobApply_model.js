const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting' },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  status: { type: String, enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], default: 'Pending' },
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', applicationSchema);
