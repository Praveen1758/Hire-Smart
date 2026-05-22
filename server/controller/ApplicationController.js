const Application = require('../model/JobApply_model');

const applyForJob = async (req, res) => {
  try {
    const { jobId, applicantId } = req.body;

    if (!jobId || !applicantId) {
      return res.status(400).json({ message: 'Job ID and Applicant ID are required' });
    }

    // Optional: prevent duplicate applications
    const existing = await Application.findOne({ jobId, applicantId });
    if (existing) {
      return res.status(409).json({ message: 'You have already applied for this job' });
    }

    const newApplication = new Application({ jobId, applicantId });
    await newApplication.save();

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Apply Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: 'jobId',
        select: 'jobTitle location jobType salaryRange'
      })
      .populate({
        path: 'applicantId',
        select: 'name email phone resume'
      });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: 'CompanyId required' });
    }

    const validStatuses = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application
      .findById(id)
      .populate('jobId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // 🔥 ownership check
    if (application.jobId.companyId.toString() !== companyId) {
      return res.status(403).json({ message: 'You cannot update this application' });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// In controller file
const getApplicationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const applications = await Application.find({ applicantId: userId })
      .populate({
        path: 'jobId',
        select: 'jobTitle location jobType salaryRange companyId',
        populate: {
          path: 'companyId',      // populate the company inside jobId
          select: 'name logo email website'
        }
      })
      .populate({
        path: 'applicantId',

        select: 'name email phone resume'
      });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getApplicationsByCompany = async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: "CompanyId is required" });
    }

    const applications = await Application.find()
      .populate({
        path: 'jobId',
        match: { companyId },   // 🔥 THIS IS THE KEY LINE
        select: 'jobTitle location jobType salaryRange companyId',
      })
      .populate({
        path: 'applicantId',
        select: 'name email phone resume'
      });

    // remove applications whose jobId didn’t match company
    const filteredApps = applications.filter(app => app.jobId !== null);

    res.status(200).json(filteredApps);
  } catch (error) {
    console.error('Error fetching company applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { applyForJob ,getAllApplications,getApplicationsByCompany,getApplicationsByUserId,updateApplicationStatus};
