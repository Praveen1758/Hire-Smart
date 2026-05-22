const UserModel = require('../model/user_model');
const CompanyModel = require('../model/Company_model');
const CategoryModel = require('../model/Category_model');
const FeedbackModel = require('../model/FeedbackModel');
const JobModel = require('../model/Job_model');
const ApplicationModel = require('../model/JobApply_model');
const mongoose = require('mongoose');

const getAdminCounts = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCompanies,
      totalCategories,
      totalFeedback
    ] = await Promise.all([
      UserModel.countDocuments(),
      CompanyModel.countDocuments(),
      CategoryModel.countDocuments(),
      FeedbackModel.countDocuments()
    ]);

    res.json({
      totalUsers,
      totalCompanies,
      totalCategories,
      totalFeedback
    });
  } catch (error) {
    res.status(500).json({ message: 'Dashboard count error', error });
  }
};

const getCompanyCounts = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: 'Invalid companyId' });
    }

    // ✅ Use 'new' with ObjectId
    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    // Count jobs for this company
    const totalJobs = await JobModel.countDocuments({ companyId: companyObjectId });

    // Get all job IDs for this company
    const jobIds = await JobModel.find({ companyId: companyObjectId }).distinct('_id');

    // Count applicants only for these jobs
    const totalApplicants = await ApplicationModel.countDocuments({
      jobId: { $in: jobIds }
    });

    res.json({ totalJobs, totalApplicants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Company dashboard error', error });
  }
};


module.exports = { getAdminCounts,getCompanyCounts };
