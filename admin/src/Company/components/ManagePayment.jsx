import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
} from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';import axios from 'axios';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ManagePayment = ({ selectedBooking }) => {
  const [transactionId, setTransactionId] = useState('');
  const [transactionError, setTransactionError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const fixedAmount = 3000;

  const handleSubmitPayment = () => {

    if (!selectedMonth) {
    setTransactionError("Please select a month before making payment");
    return;
  }
    if (!transactionId) {
      setTransactionError("Transaction ID is required");
      return;
    }

    if (!/^\d{12}$/.test(transactionId)) {
    setTransactionError("Transaction ID must be exactly 12 digits");
    return;
  }
    const companyId = localStorage.getItem('CompanyId');

    if (!companyId) {
      setTransactionError("Company ID not found in localStorage.");
      return;
    }
    axios.post('http://localhost:6102/api/payment/addPayment', {
      companyId,
      transactionId,
      amount: fixedAmount,
    })
      .then(() => {
        alert("Payment successful!");
        setTransactionError('');
        setTransactionId('');
        setSelectedMonth('');
      })
      .catch(() => {
        setTransactionError("Payment failed. Try again.");
      });
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 700, margin: 'auto', mt: 5 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Monthly Payment (₹{fixedAmount})
      </Typography>

      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary',textAlign:'left',lineHeight:'3',color:'red' }}>
        <strong>📌 Rules & Regulations:</strong><br />
        - ₹3000 fixed monthly payment is mandatory to access platform features.<br />
        - Payment should be made by the <strong>5th of every month</strong> to avoid account suspension.<br />
        - Please pay via UPI and enter the <strong>correct transaction ID</strong> below.<br />
        - <strong>No refunds</strong> are available once payment is made.<br />
        - Contact support@jobseekerportal.com for help.
      </Typography>

      <TextField
        select
        label="Select Month"
        fullWidth
        margin="normal"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
          error={!selectedMonth && Boolean(transactionError)}

      >
        {months.map((month, index) => (
          <MenuItem key={index} value={month}>{month}</MenuItem>
        ))}
      </TextField>

      <QRCodeCanvas
        value={`upi://pay?pa=your-upi-id&pn=Your+Name&am=${fixedAmount}&cu=INR`}
        size={256}
      />

      <TextField
        label="Transaction ID"
        fullWidth
        margin="normal"
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
        error={Boolean(transactionError)}
        helperText={transactionError}
      />

      <Typography variant="body1" sx={{ mt: 2 }}>
        Amount: ₹{fixedAmount}
      </Typography>

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmitPayment}>
        Pay
      </Button>
    </Paper>
  );
};

export default ManagePayment;
