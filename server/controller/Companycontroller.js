// controllers/companyController.js
const Company = require('../model/Company_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // set your own secret in env vars

const registerCompany = async (req, res) => {
  try {
    const { name, email, password, phone, description, website, address } = req.body;
if (!req.file) {
            throw new Error('Company logo is required');
        }
        const logo = req.file.filename;
    // Check if email already exists
    const existing = await Company.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const company = new Company({
      name,
      email,
      password: hashedPassword,
      phone,
logo:logo,
      description,
      website,
      address,
      // industry: req.body.industry,
    });

    await company.save();
    res.status(201).json({ success: true, message: 'Company registered successfully', companyId: company._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Login controller
const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find company by email
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    
    // Check if password matches
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if account is verified
    if (!company.isVerified) {
      return res.status(403).json({ success: false, message: 'Please wait for admin approval' });
    }

      if (company.isBlocked) {  // <--- check for block
      return res.status(403).json({ success: false, message: 'Your account has been blocked. Contact admin.' });
    }
    // Create JWT token payload
    const payload = {
      companyId: company._id,
      email: company.email,
      name: company.name,
    };

    // Sign token
    const CompanyToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    // Return token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      CompanyToken,
      contractorId: company._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find(); // <-- FIXED
    res.json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching companies' });
  }
};


// Update company verification status (accept or reject)
const updateVerificationStatus = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'accept' or 'reject'

  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.isVerified = action === 'accept' ? true : false;
    await company.save();

    res.json({ message: `Company ${action}ed successfully`, company });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating verification status' });
  }
};

const blockUnblockCompany = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'block' or 'unblock'

  if (!['block', 'unblock'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    const company = await Company.findById(id);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    company.isBlocked = action === 'block';
    await company.save();

    res.json({ message: `Company ${action}ed successfully`, company });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating block status' });
  }
};

module.exports = { blockUnblockCompany,registerCompany ,loginCompany, getCompanies, updateVerificationStatus };
