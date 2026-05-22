// routes/companyRoutes.js
const express = require('express');
const { registerCompany,loginCompany,getCompanies,updateVerificationStatus,blockUnblockCompany } = require('../controller/Companycontroller');
const router = express.Router();
const upload = require('../Middleware/Upload');
router.post('/register', upload.single('logo'), registerCompany);
router.post('/login', loginCompany);
router.get('/getCompanies', getCompanies);

// Update verification status (accept/reject)
router.put('/verify/:id',updateVerificationStatus);
router.put('/block/:id', blockUnblockCompany);
module.exports = router;
