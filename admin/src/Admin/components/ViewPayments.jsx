import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useParams } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box
} from "@mui/material";
import axios from "axios";

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${TableCell.head}`]: {
    backgroundColor: '#264d73',
    color: theme.palette.common.white,
  },
  [`&.${TableCell.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ViewPayments() {
  // const { serviceProviderId } = useParams();

  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

useEffect(() => {
  axios
    .get(`http://localhost:6102/api/payment/all`)
    .then((res) => {
      if (Array.isArray(res.data)) {
  const sortedData = res.data.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  setPayments(sortedData);
} else {
  setError("Error processing data. Please try again later.");
}

      
    })
    .catch((err) => {
      setError("Error fetching payments. Please try again later.");
      console.error("Error fetching payments:", err.response?.data || err.message);
    });
}, []);


  return (
    <div style={{ height: "100vh" }}>
      <Paper sx={{ padding: "20px" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: "#264d73", fontWeight: 500 }}
          >
            View Payments
          </Typography>
        </Box>

        {error && <Typography color="error">{error}</Typography>}

        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
         <TableHead>
  <TableRow>
    <StyledTableCell align="center">SL .No</StyledTableCell>
    <StyledTableCell align="center">Company Name</StyledTableCell>
    {/* <StyledTableCell align="center">Job Title</StyledTableCell> */}
    <StyledTableCell align="center">Transaction ID</StyledTableCell>
    <StyledTableCell align="center">Amount (₹)</StyledTableCell>
    <StyledTableCell align="center">Status</StyledTableCell>
    <StyledTableCell align="center">Created At</StyledTableCell>
  </TableRow>
</TableHead>

<TableBody>
  {payments.length > 0 ? (
    payments.map((row,index) => (
      <StyledTableRow key={row._id}>
        <StyledTableCell align="center">{index+1}</StyledTableCell>
        {/* <StyledTableCell align="center">
          {row.userId?.name || "N/A"}
        </StyledTableCell> */}
        <StyledTableCell align="center">
          {row.companyId?.name || "N/A"}
        </StyledTableCell>
        <StyledTableCell align="center">{row.transactionId}</StyledTableCell>
        <StyledTableCell align="center">₹{row.amount}</StyledTableCell>
        <StyledTableCell align="center">{row.paymentStatus}</StyledTableCell>
        <StyledTableCell align="center">{new Date(row.createdAt).toLocaleString()}</StyledTableCell>
      </StyledTableRow>
    ))
  ) : (
    <StyledTableRow>
      <StyledTableCell align="center" colSpan={7}>
        No Payment Records Found
      </StyledTableCell>
    </StyledTableRow>
  )}
</TableBody>


          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
