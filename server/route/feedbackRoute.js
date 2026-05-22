const express = require('express');
const router = express.Router();
const feedbackController = require('../controller/FeedbackController');

router.post('/addFeedback', feedbackController.addFeedback);
router.get('/getFeedbacks', feedbackController.getFeedbacks);

module.exports = router;
