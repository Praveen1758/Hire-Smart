
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: Number,
    },
    address: {
        type: String,
    },
    password: {
        type: String,
    },
     resume: {
        type: String, // Store filename or URL of uploaded resume
    },
    skills: [
  {
    name: String,
    level: String // optional: beginner, intermediate, expert
  }
],

    experience: [{
        company: String,
        role: String,
        duration: String,
        description: String
    }],
    education: [{
        degree: String,
        institution: String,
        yearOfPassing: Number
    }],
    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobPosting' // Replace with your actual job model name
    }],
    profileImage: {
        type: String // Optional: for profile photo
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
//     isWillingToPay: {
//     type: Boolean,
//     default: true,
  
// }

});

module.exports =  mongoose.model('User', userSchema);


