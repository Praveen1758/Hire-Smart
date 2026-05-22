
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography
} from '@mui/material';

const ApplicationDetails = () => {
  const [applications, setApplications] = useState([]);

useEffect(() => {
  const companyId = localStorage.getItem("CompanyId");

  if (!companyId) return;

  axios
    .get(`http://localhost:6102/api/application/getApplicationsByCompany?companyId=${companyId}`)
    .then(res => setApplications(res.data))
    .catch(err => console.error('Error fetching applications:', err));
}, []);

const handleStatusChange = (newStatus, appId) => {
  const confirmUpdate = window.confirm(
    `Are you sure you want to update the status to "${newStatus}"?`
  );
  if (!confirmUpdate) return;

  const companyId = localStorage.getItem("CompanyId");

  axios.put(
    `http://localhost:6102/api/application/updateStatus/${appId}`,
    {
      status: newStatus,
      companyId: companyId   // ✅ REQUIRED
    }
  )
  .then(res => {
    setApplications(prev =>
      prev.map(app =>
        app._id === appId ? { ...app, status: newStatus } : app
      )
    );
    alert("Status updated successfully!");
  })
  .catch(err => {
    console.error('Error updating status:', err.response?.data || err);
    alert(err.response?.data?.message || "Failed to update status");
  });
};

  return (
    
    <TableContainer component={Paper} style={{marginTop:'60px'}} >
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell><strong>Applicant Name</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Phone</strong></TableCell>
            <TableCell><strong>Resume</strong></TableCell>
            <TableCell><strong>Job Title</strong></TableCell>
            <TableCell><strong>Location</strong></TableCell>
            <TableCell><strong>Job Type</strong></TableCell>
            <TableCell><strong>Salary Range</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Applied At</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((app, index) => (
            
            <TableRow key={index}>
              <TableCell>{app.applicantId?.name}</TableCell>
              <TableCell>{app.applicantId?.email}</TableCell>
              <TableCell>{app.applicantId?.phone}</TableCell>
              <TableCell>
                {app.applicantId?.resume ? (
                  <a href={`http://localhost:6102/api/image/${app.applicantId.resume}`} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                ) : 'N/A'}
              </TableCell>
              <TableCell>{app.jobId?.jobTitle}</TableCell>
              <TableCell>{app.jobId?.location}</TableCell>
              <TableCell>{app.jobId?.jobType}</TableCell>
              <TableCell>{app.jobId?.salaryRange ? `${app.jobId.salaryRange.min} - ${app.jobId.salaryRange.max}` : 'N/A'}</TableCell>
          <TableCell>
            <select
              value={app.status}
              onChange={(e) => handleStatusChange(e.target.value, app._id)}
              disabled={app.status === "Accepted" || app.status === "Rejected"} // ✅ disable if final
            >
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </TableCell>


              <TableCell>{new Date(app.appliedAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ApplicationDetails;
