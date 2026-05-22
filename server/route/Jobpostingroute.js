const express = require('express');
const router = express.Router();
const jobController = require('../controller/jobPostingController');
// const authCompany = require('../Middleware/authCompany');


router.get('/getAllJobPostings', jobController.getAllJobPostings);
router.get('/getJobPostingById/:id', jobController.getJobPostingById);

router.post('/createJobPosting', jobController.createJobPosting);
router.put('/updateJobPosting/:id', jobController.updateJobPosting);
router.delete('/deleteJobPosting/:id', jobController.deleteJobPosting);
router.get('/getCompanyJobs', jobController.getcompanyjobs);
router.post('/enquiry',jobController.Chat)


// router.post('/createJobPosting', authCompany, jobController.createJobPosting);
// router.put('/updateJobPosting/:id', authCompany, jobController.updateJobPosting);
// router.delete('/deleteJobPosting/:id', authCompany, jobController.deleteJobPosting);
// router.get('/getCompanyJobs', authCompany, jobController.getcompanyjobs);


module.exports = router;
