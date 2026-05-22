const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardController');

router.get('/counts', dashboardController.getAdminCounts);
router.get('/count/:companyId', dashboardController.getCompanyCounts);



module.exports = router;
