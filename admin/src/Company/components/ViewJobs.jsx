import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function ViewJobs() {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
  const companyId = localStorage.getItem('CompanyId');

  if (!companyId) return;
    axios.get(`http://localhost:6102/api/jobs/getCompanyJobs?companyId=${companyId}`)
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  const handleOpenDialog = (job) => {
    setSelectedJob(job);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedJob(null);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>All Job Postings</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Job Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job.jobTitle}</TableCell>
                <TableCell>{job.companyId?.name}</TableCell>
                <TableCell>{job.jobCategory?.category_name}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.jobType}</TableCell>
                <TableCell>₹{job.salaryRange.min} - ₹{job.salaryRange.max}</TableCell>
                <TableCell>{new Date(job.deadline).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(job)}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog to show skills and qualifications */}
      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Qualifications</Typography>
          <List>
            {selectedJob?.qualifications?.map((q, index) => (
              <ListItem key={index}>
                <ListItemText primary={q.qualification} />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6">Skills</Typography>
          <List>
            {selectedJob?.skills?.map((s, index) => (
              <ListItem key={index}>
                <ListItemText primary={s.skill} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
