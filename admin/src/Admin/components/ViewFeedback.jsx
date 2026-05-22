import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
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

export default function ViewFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:6102/api/feedback/getFeedbacks")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const sortedData = res.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setFeedbacks(sortedData);
        } else {
          setError("Error processing data. Please try again later.");
        }
      })
      .catch((err) => {
        setError("Error fetching feedbacks. Please try again later.");
        console.error("Error fetching feedbacks:", err.response?.data || err.message);
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
            View Feedback
          </Typography>
        </Box>

        {error && <Typography color="error">{error}</Typography>}

        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">SL. No</StyledTableCell>
                <StyledTableCell align="center">User Name</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Job Title</StyledTableCell>
                <StyledTableCell align="center">Feedback</StyledTableCell>
                <StyledTableCell align="center">Submitted On</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.length > 0 ? (
                feedbacks.map((row, index) => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell align="center">{index + 1}</StyledTableCell>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">{row.email}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.jobId?.jobTitle || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.feedback}</StyledTableCell>
                    <StyledTableCell align="center">
                      {new Date(row.createdAt).toLocaleString()}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell align="center" colSpan={6}>
                    No Feedback Records Found
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
