const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },

    jobCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Remote'],
    required: true
  },
  salaryRange: {
    min: {
      type: Number
    },
    max: {
      type: Number
    }
  },
  qualifications: [{ qualification: String }],
  experienceRequired: { type: String, required: true },
  skills: [{ skill: String }],

  postedDate: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('JobPosting', jobPostingSchema);
