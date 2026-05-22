const Feedback = require('../model/FeedbackModel');

const addFeedback = async (req, res) => {
  try {
    const { applicationId, userId, jobId, name, email, feedback } = req.body;

    if (!applicationId || !userId || !jobId || !name || !email || !feedback) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newFeedback = new Feedback({
      applicationId,
      userId,
      jobId,
      name,
      email,
      feedback
    });

    const saved = await newFeedback.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error adding feedback:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('applicationId')
      .populate('userId')
      .populate('jobId');
    res.status(200).json(feedbacks);
  } catch (err)  {
    console.error('Error fetching feedbacks:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addFeedback,
  getFeedbacks
};
