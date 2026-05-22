import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Snackbar, Alert, Typography,
} from '@mui/material';

export default function ViewUser() {
  const host = config.host;

  const [users, setUsers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get(`${host}/api/user/Getuser`)
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error(err);
        showSnackbar('Failed to fetch users', 'error');
      });
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  const handleDelete = (id) => {
          if (window.confirm('Are you sure you want to delete this user?')) {
              axios.delete(`${host}/api/user/DeleteUser/${id}`)
                  .then((res) => {
                      setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
                      setSnackbarMessage('User deleted successfully');
                      setSnackbarSeverity('success');
                      setSnackbarOpen(true);
                  })
                  .catch((err) => {
                      console.log(err);
                      setSnackbarMessage('Failed to delete category');
                      setSnackbarSeverity('error');
                      setSnackbarOpen(true);
                  });
          }
      };
  
  return (
    <div style={{ overflowX: 'auto', padding: 20 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#19334d' }}>
        Manage Users
      </Typography>

      <TableContainer component={Paper}>
        <Table aria-label="manage user table" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#19334d' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#19334d' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#19334d' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#19334d' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isBlocked ? 'Blocked' : 'Active'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </Button>
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
