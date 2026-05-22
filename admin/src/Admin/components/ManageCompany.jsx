import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Snackbar, Alert, Typography,
} from '@mui/material';

export default function ManageCompany() {
  const host = config.host;

  const [companies, setCompanies] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {
    axios.get(`${host}/api/company/getCompanies`)
      .then(res => setCompanies(res.data))
      .catch(err => {
        console.error(err);
        showSnackbar('Failed to fetch companies', 'error');
      });
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Accept / Reject
  const handleVerify = (id, action) => {
    axios.put(`${host}/api/company/verify/${id}`, { action })
      .then(res => {
        showSnackbar(res.data.message, 'success');
        // Update company in state
        setCompanies(prev =>
          prev.map(c => 
            c._id === id 
              ? { ...c, isVerified: action === 'accept', isBlocked: false, rejected: action === 'reject' } 
              : c
          )
        );
      })
      .catch(err => {
        console.error(err);
        showSnackbar('Failed to update verification status', 'error');
      });
  };

  // Block / Unblock
  const handleBlock = (id, action) => {
    axios.put(`${host}/api/company/block/${id}`, { action }) // You need to create this route
      .then(res => {
        showSnackbar(res.data.message, 'success');
        setCompanies(prev =>
          prev.map(c =>
            c._id === id ? { ...c, isBlocked: action === 'block' } : c
          )
        );
      })
      .catch(err => {
        console.error(err);
        showSnackbar('Failed to update block status', 'error');
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ overflowX: 'auto', padding: 20 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#19334d' }}>
        Manage Companies
      </Typography>

      <TableContainer component={Paper}>
        <Table aria-label="manage company table" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#19334d' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#19334d' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#19334d' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#19334d' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map(company => (
              <TableRow key={company._id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell>
                  {company.rejected ? 'Rejected' : company.isVerified ? (company.isBlocked ? 'Blocked' : 'Accepted') : 'Pending'}
                </TableCell>
                <TableCell>
                  {/* Pending: Show Accept / Reject */}
                  {!company.isVerified && !company.rejected && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleVerify(company._id, 'accept')}
                        sx={{ mr: 1 }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleVerify(company._id, 'reject')}
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {/* Accepted: Show Block / Unblock */}
                  {company.isVerified && !company.rejected && (
                    <>
                      <Button
                        variant="contained"
                        color={company.isBlocked ? 'success' : 'error'}
                        size="small"
                        onClick={() => handleBlock(company._id, company.isBlocked ? 'unblock' : 'block')}
                      >
                        {company.isBlocked ? 'Unblock' : 'Block'}
                      </Button>
                    </>
                  )}

                  {/* Rejected: No buttons */}
                  {company.rejected && <span style={{ fontStyle: 'italic', color: 'red' }}>No actions</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
