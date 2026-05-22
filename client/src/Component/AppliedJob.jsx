import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { Modal, Box, TextField, Button, IconButton, Menu, MenuItem } from '@mui/material';
import ChatWidget from './ChatWidget';


export default function AppliedJob() {

  const [applications, setApplications] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [transactionError, setTransactionError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
const [anchorEl, setAnchorEl] = useState(null);
const [menuAppId, setMenuAppId] = useState(null);
const [paidApps, setPaidApps] = useState([]);
const [feedbackGivenApps, setFeedbackGivenApps] = useState([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
const navigate = useNavigate();

useEffect(() => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert("Please login to continue.");
    navigate('/login');
    return;
  }

  axios.get(`http://localhost:6102/api/application/getApplicationsByUserId/${userId}`)
    .then(res => {
      setApplications(res.data);
    })
    .catch(err => {
      console.error('Error fetching user applications:', err);
    });
}, [navigate]);



  const handlePaymentOpen = (application) => {
    setSelectedApplication(application);
    setSelectedBooking({ ...application, amount: 2500 }); // set amount dynamically if needed
    setPaymentOpen(true);
    setPaymentSuccess(false);
  };

  const handlePaymentClose = () => {
    setPaymentOpen(false);
    setTransactionId('');
    setTransactionError('');
  };

  const handleFeedbackClose = () => {
    setFeedbackOpen(false);
    setName('');
    setEmail('');
    setFeedback('');
  };

  const handleSubmitPayment = () => {
    if (!transactionId) {
      setTransactionError("Transaction ID is required");
      return;
    }

    axios.post('http://localhost:6102/api/payment/addPayment', {
      ApplicationId: selectedApplication._id,
      userId: selectedApplication.applicantId._id,
      JobId: selectedApplication.jobId._id,
      transactionId,
      amount: selectedBooking.amount,
    })
     .then(() => {
  setPaymentSuccess(true);
  alert("Payment successful!");
  setPaidApps(prev => [...prev, selectedApplication._id]);
  setPaymentOpen(false);
  setFeedbackOpen(false);
})

      .catch(() => {
        setTransactionError("Payment failed. Try again.");
      });
  };

const handleFeedbackSubmit = async () => {
  try {
    const response = await axios.post(
      'http://localhost:6102/api/feedback/addFeedback',
      {
        applicationId: selectedApplication._id,
        userId: selectedApplication.applicantId._id,
        jobId: selectedApplication.jobId._id,
        name,
        email,
        feedback,
      }
    );

    if (response.status === 201 || response.status === 200) {
      alert("Feedback submitted successfully!");

      // ✅ MARK THIS APPLICATION AS FEEDBACK GIVEN
      setFeedbackGivenApps(prev => [...prev, selectedApplication._id]);

      setFeedback('');
      setFeedbackOpen(false);
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    alert("Failed to submit feedback. Please try again.");
  }
};


  const timeAgo = (date) => {
  const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
  return `${diff} day${diff !== 1 ? 's' : ''} ago`;
};

const statusColors = {
  Pending: '#facc15',
  Reviewed: '#1e3a8a',
  Accepted: '#16a34a',
  Rejected: '#dc2626',
  Viewed: '#7c3aed',
};

const getStatusButton = (status) => (
  <button
    className="eg-btn"
    style={{
      backgroundColor: statusColors[status] || statusColors.Viewed,
      color: '#ffffff',
    }}
  >
    {status}
  </button>
);


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: '#ffffff',   // ✅ use bgcolor
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  zIndex: 1300,         // ✅ ensure it appears above
};


  return (
    <div>

      <ChatWidget/>
 <div className="inner-banner">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="banner-content text-center">
            <h1>Applied Jobs</h1>
            <span />
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Applied Jobs</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>

<div className="dashboard-area pt-120 mb-120">
  <div className="container">
    <div className="row g-lg-4 gy-5 mb-90">
      <div className="col-lg-6">
      </div>
      <div className="col-lg-12">
        <div className="applied-job-area">
          <div className="table-wrapper">
            <div className="table-title-filter">
            </div>
            <table className="eg-table table category-table mb-30">
              <thead style={{backgroundColor:"#0a2f44"}}>
                <tr>
                  <th>Job Tittle</th>
                  <th>Job Type</th>
                  <th>Apply Date</th>
                  <th>Company</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                <tr>
                  <td data-label="Job Title">
                    <div className="company-info">
                      <div className="logo">
                        <img
                        src={`http://localhost:6102/api/image/${application.jobId?.companyId?.logo}`}
                        style={{ width: 100, height: 60, objectFit: "contain" ,borderRadius:"30px"}}
                        alt={application.jobId?.companyId?.name}
                        />
                      </div>
                      <div className="company-details">
                        <div className="top">
                          <h6><a href="">{application.jobId?.jobTitle}</a></h6>
                          <span><img src="assets/images/icon/calender2.svg" alt />{timeAgo(application.appliedAt)}</span>
                        </div>
                        <ul>
                          <li><img src="assets/images/icon/location.svg" alt />{application.jobId?.location}</li>
                          <li>
                            <img src="assets/images/icon/arrow2.svg" alt />
                            <p><span className="title">Salary:</span>₹{application.jobId?.salaryRange?.min} - ₹{application.jobId?.salaryRange?.max}/<span className="time">per Month</span></p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                <td data-label="Job Type">{application.jobId?.jobType}</td>
                  <td data-label="Apply Job">  {new Date(application.appliedAt).toLocaleDateString('en-GB')}</td>
                  <td data-label="Company"><a className="view-btn" href="">{application.jobId?.companyId?.name}</a></td>
              <td data-label="Status">
                {getStatusButton(application.status)}

                {/* SHOW SUBMIT FEEDBACK BUTTON */}
                {application.status === 'Accepted' &&
                  !feedbackGivenApps.includes(application._id) && (
                    <div style={{ marginTop: '6px' }}>
                      <button
                        className="eg-btn"
                        style={{
                          backgroundColor: '#2563eb',
                          color: '#fff',
                          fontSize: '12px',
                          padding: '4px 10px'
                        }}
                        onClick={() => {
                          setSelectedApplication(application);
                          setFeedbackOpen(true);
                        }}
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}

                {/* SHOW FEEDBACK SUBMITTED TEXT */}
                {feedbackGivenApps.includes(application._id) && (
                  <div style={{ marginTop: '6px', fontSize: '12px', color: 'green' }}>
                    ✔ Feedback submitted
                  </div>
                )}
              </td>
       
                      </tr>
                ))}
              </tbody>
            </table>
            {/* <div className="pagination-table-info">
              <div className="table-info">
                <span>06 Results Showing In 20 Jobs</span>
              </div>
              <div className="pagination-area">
                <nav aria-label="...">
                  <ul className="pagination">
                    <li className="page-item disabled"><a className="page-link" href="#" tabIndex={-1} /></li>
                    <li className="page-item active" aria-current="page"><a className="page-link" href="#">01</a></li>
                    <li className="page-item"><a className="page-link" href="#">02</a></li>
                    <li className="page-item"><a className="page-link" href="#">03</a></li>
                    <li className="page-item"><a className="page-link" href="#" /></li>
                  </ul>
                </nav>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<Modal open={feedbackOpen} onClose={handleFeedbackClose}>
  <Box sx={modalStyle}>
    <h3>Give Feedback</h3>

    <TextField
      label="Name"
      fullWidth
      margin="normal"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    <TextField
      label="Email"
      fullWidth
      margin="normal"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <TextField
      label="Feedback"
      fullWidth
      multiline
      rows={4}
      margin="normal"
      value={feedback}
      onChange={(e) => setFeedback(e.target.value)}
    />

    <Button
      variant="contained"
      fullWidth
      sx={{ mt: 2 }}
      onClick={handleFeedbackSubmit}
    >
      Submit Feedback
    </Button>
  </Box>
</Modal>

      
    </div>
  )
}
