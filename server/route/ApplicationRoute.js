const express = require('express');
const router = express.Router();
const { applyForJob,getAllApplications,updateApplicationStatus,getApplicationsByUserId,getApplicationsByCompany} = require('../controller/ApplicationController');

// POST route to apply for job
router.post('/apply', applyForJob);
router.get('/getAllApplications', getAllApplications);
router.put('/updateStatus/:id', updateApplicationStatus);
router.get('/getApplicationsByUserId/:userId', getApplicationsByUserId);
router.get('/getApplicationsByCompany', getApplicationsByCompany);


module.exports = router;
