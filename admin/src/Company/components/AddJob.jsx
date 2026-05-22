import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, TextField, Button, Grid, MenuItem } from '@mui/material';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

export default function AddJob() {
  const API_HOST = "http://localhost:6102";
  const API_ENDPOINT = "/api/jobs/createJobPosting"; // Adjust to your backend endpoint
  const navigate = useNavigate();
const [jobData, setJobData] = useState({
  companyId: '',
  jobTitle: '',
  jobDescription: '',
  jobCategory: '',
  location: '',
  jobType: '',
  salaryMin: '',
  salaryMax: '',
  qualifications: [{ qualification: '' }],
  experienceRequired: '',
  skills: [{ skill: '' }],
  deadline: '',
});


  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Fetch category and company data for dropdowns
  useEffect(() => {
    axios.get(`${API_HOST}/api/category/Getcategory`).then(res => setCategories(res.data));
    axios.get(`${API_HOST}/api/company/getCompanies`).then(res => setCompanies(res.data));
  }, []);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

const handleSubmit = () => {
  const payload = {
    ...jobData,
    salaryRange: {
      min: Number(jobData.salaryMin),
      max: Number(jobData.salaryMax),
    },
    skills: jobData.skills.map(s => ({ skill: s.skill.trim() })),
    qualifications: jobData.qualifications.map(q => ({ qualification: q.qualification.trim() }))
  };

  console.log("Payload being sent:", payload); // 👈 Add this

  axios.post(`${API_HOST}${API_ENDPOINT}`, payload)
    .then(() => {
      alert("Job posted successfully!");
      navigate('/Company/ViewJobs');
      // reset...
    })
    .catch((err) => {
      console.error("Error posting job:", err);
      alert("Failed to post job.");
    });
};


const handleSkillChange = (index, value) => {
  const updatedSkills = [...jobData.skills];
  updatedSkills[index].skill = value;
  setJobData({ ...jobData, skills: updatedSkills });
};

const addSkillField = () => {
  setJobData({ ...jobData, skills: [...jobData.skills, { skill: '' }] });
};

const removeSkillField = (index) => {
  const updatedSkills = jobData.skills.filter((_, i) => i !== index);
  setJobData({ ...jobData, skills: updatedSkills });
};

const handleQualificationChange = (index, value) => {
  const updatedQualifications = [...jobData.qualifications];
  updatedQualifications[index].qualification = value;
  setJobData({ ...jobData, qualifications: updatedQualifications });
};

const addQualificationField = () => {
  setJobData({ ...jobData, qualifications: [...jobData.qualifications, { qualification: '' }] });
};

const removeQualificationField = (index) => {
  const updatedQualifications = jobData.qualifications.filter((_, i) => i !== index);
  setJobData({ ...jobData, qualifications: updatedQualifications });
};

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <Paper elevation={10} sx={{ p: 4, width: '80%' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Post a Job
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Select Company"
              name="companyId"
              value={jobData.companyId}
              onChange={handleChange}
              fullWidth
            >
              {companies.map((company) => (
                <MenuItem key={company._id} value={company._id}>
                  {company.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="jobTitle"
              label="Job Title"
              value={jobData.jobTitle}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="jobDescription"
              label="Job Description"
              multiline
              rows={4}
              value={jobData.jobDescription}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Select Category"
              name="jobCategory"
              value={jobData.jobCategory}
              onChange={handleChange}
              fullWidth
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.category_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="location"
              label="Location"
              value={jobData.location}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Job Type"
              name="jobType"
              value={jobData.jobType}
              onChange={handleChange}
              fullWidth
            >
              {['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Remote'].map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              name="salaryMin"
              label="Min Salary"
              type="number"
              value={jobData.salaryMin}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              name="salaryMax"
              label="Max Salary"
              type="number"
              value={jobData.salaryMax}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="experienceRequired"
              label="Experience Required"
              value={jobData.experienceRequired}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
            <Grid item xs={12} md={6}>
            <TextField
              name="deadline"
              label="Application Deadline"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={jobData.deadline}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
  <Typography variant="subtitle1">Qualifications</Typography>
  {jobData.qualifications.map((item, index) => (
    <Box key={index} display="flex" gap={1} mb={1}>
      <TextField
        fullWidth
        value={item.qualification}
        onChange={(e) => handleQualificationChange(index, e.target.value)}
        label={`Qualification ${index + 1}`}
      />
      <Button onClick={() => removeQualificationField(index)} disabled={jobData.qualifications.length === 1}>Remove</Button>
    </Box>
  ))}
  <Button onClick={addQualificationField}>Add Qualification</Button>
</Grid>

<Grid item xs={12} md={6}>
  <Typography variant="subtitle1">Skills</Typography>
  {jobData.skills.map((item, index) => (
    <Box key={index} display="flex" gap={1} mb={1}>
      <TextField
        fullWidth
        value={item.skill}
        onChange={(e) => handleSkillChange(index, e.target.value)}
        label={`Skill ${index + 1}`}
      />
      <Button onClick={() => removeSkillField(index)} disabled={jobData.skills.length === 1}>Remove</Button>
    </Box>
  ))}
  <Button onClick={addSkillField}>Add Skill</Button>
</Grid>

        
        </Grid>
        <Box mt={3} textAlign="center">
          <Button variant="contained" onClick={handleSubmit}>
            Post Job
          </Button>
        </Box>
      </Paper>
      
    </Box>

  );
}
