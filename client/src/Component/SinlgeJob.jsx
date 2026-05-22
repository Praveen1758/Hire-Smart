import React from 'react'
import { Link } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography'
import ChatWidget from './ChatWidget';

export default function SinlgeJob() {

  const { id } = useParams(); // job ID from URL
  const hasLogged = useRef(false);
  const [job, setJob] = useState(null);
  const navigate = useNavigate();
   const userId = localStorage.getItem('userId'); // assuming stored on login


  const timeAgo = (date) => {
  const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
  return `${diff} day${diff !== 1 ? 's' : ''} ago`;
};


const handleApply = async () => {
  try {
    const res = await axios.post('http://localhost:6102/api/application/apply', {
      jobId: id, // ✅ Use `id` from useParams
      applicantId: userId
    });

    alert(res.data.message);
    navigate('/Applications'); // Redirect to Applications page
  } catch (error) {
    if (error.response?.status === 409) {
      alert('You have already applied for this job');
    } else {
      alert('Error submitting application');
      console.error(error);
    }
  }
};

  const userToken = localStorage.getItem('userToken');

useEffect(() => {
  if (!userToken) {
    alert('You need to be logged in to view this job.');
    navigate('/login');
    return;
  }

  // Fetch job data
  axios
    .get(`http://localhost:6102/api/jobs/getJobPostingById/${id}`)
    .then((res) => {
      setJob(res.data);

      // Insert log only once
if (!hasLogged.current) {
  axios.post(`http://localhost:6102/api/log/insert/${userId}`, { 
      jobId: res.data._id  // send jobId in body
  })
  .then(res => console.log("Log inserted:", res.data))
  .catch(err => console.error("Error inserting log:", err));

  hasLogged.current = true; // mark as logged
}
    })
    .catch((err) => console.error(err));
}, [id, navigate, userToken, userId]);

  if (!job) return <Typography>Loading...</Typography>;
  return (
    <div>
      
<div>
  <ChatWidget/>
  {/* ========== Inner Banner Start============= */}
  <div className="inner-banner">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="banner-content text-center">
            <h1>Job Details</h1>
            <span />
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Job Details</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* ========== Inner Banner end============= */}
  {/* ========== Job Details Start============= */}
  <div className="job-details-pages pt-120 mb-120">
    <div className="container">
      <div className="row g-lg-4 gy-5">
        <div className="col-lg-8">
          <div className="job-details-content">
            <div className="job-list-content">
              <div className="company-area">
                <div className="logo">
                  <img
                    src={`http://localhost:6102/api/image/${job.companyId?.logo}`}
                    style={{ width: 100, height: 60, objectFit: "contain" ,borderRadius:"30px"}}
                    alt={job.companyId?.name}
                    />
                </div>
                <div className="company-details">
                  <div className="name-location">
                    <h5>{job.jobTitle}</h5>
                        <p>
                        {" "}
                        <a 
                            href={job.companyId?.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            {job.companyId?.name}
                        </a>
                        </p></div>
                </div>
              </div>
              <div className="job-discription">
                <ul className="one">
                  <li>
                    <img src="/assets/images/icon/map-2.svg" alt />
                    <p><span className="title">Location:</span>{job.location}</p>
                  </li>
                  <li>
                    <img src="/assets/images/icon/category-2.svg" alt />
                    <p><span className="title">Category:</span>{job.jobCategory?.category_name}</p>
                  </li>
                </ul>
                <ul>
                  <li>
                    <img src="/assets/images/icon/company-2.svg" alt />
                    <p><span className="title">Job Type:</span>{job.jobType}</p>
                  </li>
                  <li>
                    <img src="/assets/images/icon/salary-2.svg" alt />
                    <p><span className="title">Salary:</span>₹{job.salaryRange?.min} - ₹{job.salaryRange?.max}/per Month</p>
                  </li>
                </ul>
              </div>
            </div>
            <p><span>Job Description:</span>{job.jobDescription}</p>
            <br />
          <h6 style={{ marginBottom: '8px' }}>Educational Requirements:</h6>
          <ul>
            {job.qualifications
              ?.filter(q => q?.qualification?.trim())
              .map((q, index) => (
                <li key={index}>{q.qualification}</li>
              ))}
          </ul>
          <h6 style={{ marginBottom: '8px' }}>Skills Required:</h6>
          <ul>
            {job.skills
              ?.filter(s => s?.skill?.trim())
              .map((s, index) => (
                <li key={index}>{s.skill}</li>
              ))}
          </ul>
            <h6>Experiences:</h6>
            <ul>
              <li> {job.experienceRequired} Years in this field.</li>
            </ul>
            {/* <p><span></span> Some specific tasks that a UI/UX designer might be responsible for include:</p>
            <ul>
              <li>Gathering and analyzing user requirements to inform the design of new software or web applications.</li>
              <li>Designing the layout, visual design, and interactivity of the user interface.</li>
              <li>Developing and maintaining design systems and style guides to ensure consistency in theux</li>
              <li>Collaborating with cross-functional teams, including product management, engineering, and marketing, to ensure that the user interface is aligned with business and technical requirements</li>
            </ul>
            <p><span>Extra Benefits:</span>  Some specific tasks that a UI/UX designer might be responsible for include:</p>
            <ul>
              <li>Any health care.</li>
              <li>Yearly performance bonus.</li>
              <li>Flexibility &amp; remote working.</li>
              <li>Two days off weekly.</li>
            </ul> */}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="job-details-sidebar mb-120">
            <div className="save-apply-btn d-flex justify-content-end mb-50">
              <ul>
                <li>{timeAgo(job.postedDate)}</li>
                <li><a className="primry-btn-2 lg-btn" onClick={handleApply}>Apply Position</a></li>
              </ul>
            </div>
            <div className="job-summary-area mb-50" style={{backgroundColor:"rgb(236, 236, 236)"}}>
              <div className="job-summary-title">
                <h6>Job Summary:</h6>
              </div>
              <ul>
                <li><p><span className="title">Job Posted:</span> 
                {new Date(job.postedDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            }).replace(/ (\d{4})$/, ', $1')}
                  </p></li>
                <li><p><span className="title">Expiration:</span>
                {new Date(job.deadline).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            }).replace(/ (\d{4})$/, ', $1')}
                            </p></li>
                <li><p><span className="title">Experiences:</span> {job.experienceRequired} Years.</p></li>
                <li><p><span className="title">Education:</span>{" "}
            {job.qualifications
              ?.filter(q => q?.qualification?.trim())
              .map(q => q.qualification)
              .join(', ')}
              </p></li>
                <li><p><span className="title">Gender:</span> Both.</p></li>
              </ul>
            </div>
            <div className="email-area mb-50">
              <div className="title">
                <h6><img src="/assets/images/icon/email-2.svg" alt />Email Now</h6>
              </div>
              <p>
                Send your resume at{" "}  
                <a href={`mailto:${job.companyId?.email}`}>
                      {job.companyId?.email}

                </a>
              </p>            
              </div>
          </div>
        </div>
      </div>

    </div>
  </div>
  {/* ========== Job Details End============= */}
</div>

    </div>
  )
}
