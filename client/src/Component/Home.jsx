import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ChatWidget from './ChatWidget';
// import config from '../config';

export default function Home() {

      // const host = config.host;
      const [data, setData] = useState([]);
      const [jobs, setJobs] = useState([]);
      const [recommendedJobs, setRecommendedJobs] = useState([]);
      const [viewJobs, setViewJobs] = useState([]);


useEffect(() => {
  const fetchRecommendedJobs = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      // 🔹 fetch user
      const userRes = await axios.get(
        `http://localhost:6102/api/user/getUserById/${userId}`
      );

      const user = userRes.data.user;
      if (!user?.resume) return;

      // 🔹 download resume
      const resumeBlob = await axios.get(
        `http://localhost:6102/api/image/${user.resume}`,
        { responseType: "blob" }
      );

      const resumeFile = new File(
        [resumeBlob.data],
        user.resume,
        { type: resumeBlob.data.type }
      );

      const formData = new FormData();
      formData.append("resume", resumeFile);

      const response = await axios.post(
        "http://localhost:5000/recommend",
        formData
      );

      setRecommendedJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Recommendation error:", error);
    }
  };

  fetchRecommendedJobs();
}, []);



// view log

useEffect(() => {
  const fetchRecommendations = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/recommend/jobs/${userId}`
      );

      setViewJobs(res.data.recommendations);
    } catch (err) {
      console.log(err);
    }
  };

  fetchRecommendations();
}, []);

      useEffect(() => {
          axios.get(`http://localhost:6102/api/Category/GetCategory`)
              .then((res) => {
                  setData(res.data);
              })
              .catch((err) => {
                  console.log(err);
              });
      }, []);


    useEffect(() => {  
      axios.get(`http://localhost:6102/api/jobs/getAllJobPostings`)
        .then((res) => setJobs(res.data))
        .catch((err) => console.error("Error fetching jobs:", err));
    }, []);

  return (
    <div>
      
<div>
  {/* ========== Hero One Start============= */}
  <ChatWidget />
  <div className="hero1"  style={{ height: "600px"}}>
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="hero-content" >
            <h1 style={{color:"black"}}>Your Career’s <span style={{color:"black"}}>Opportunity.</span></h1>
            <p style={{color:"black"}}>Find verified jobs, apply faster, and get noticed by top employers.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* ========== Hero One end============= */}
<div className="home5-category-area mb-120" style={{ marginTop: "60px" }}>
  <div className="container">
    <div className="row mb-60">
      <div className="col-12 d-flex justify-content-center">
        <div className="section-title3 text-center">
          <h2>Jobs Category List</h2>
          <p>Explore top job categories and connect with opportunities tailored for your growth.</p>
        </div>
      </div>
    </div>
    <div className="row justify-content-center g-4 mb-50">
      {data.slice(0, 4).map((category, index) => (
        <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
          <div className="job-category-card3 hover-btn">
            <span className="for-border" />
            <div className="job-content-inner">
              <div className="cart-front">
                <div className="category-icon">
                  {/* Optional: You can use an SVG icon or category.icon */}
                  <svg width={30} height={30} viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                    <path d="..." />
                  </svg>
                </div>
                <div className="category-content">
                  <h5>
                    <a href="">{category.category_name}</a>
                  </h5>
                  <p>{category.jobsCount} Jobs Available</p>
                </div>
              </div>
              <div className="card-back">
                <div className="category-img">
                  <img src={`http://localhost:6102/api/image/${category.category_image}`} alt={category.category_name} />
                </div>
                <div className="category-content">
                  <div className="category-icon">
                    <svg width={30} height={30} viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                      <path d="..." />
                    </svg>
                  </div>
                  <h5>
                    <Link to="/job">{category.category_name}</Link>
                  </h5>
                  <div className="view-btn1">
                    <Link to="/job">
                      View All <i className="bi bi-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="row">
      <div className="col-lg-12 d-flex justify-content-center">
        <div className="explore-all-btn5">
          <Link to="/job">
            Explore All Category <span><img src="assets/images/icon/explore-ellipse5.svg" alt="" /></span>
          </Link>
        </div>
      </div>
    </div>
  </div>
</div>

{/* ========== Home Five Category End============= */}

  {/* ========== Home1 Featured Start============= */}
  <div className="home1-featured-area mb-120">
    <div className="container">
      <div className="row mb-60">
        <div className="col-12 d-flex flex-wrap align-items-end justify-content-md-between justify-content-start gap-3">
          <div className="section-title1">
            <h2>Latest <span>Featured</span> Jobs</h2>
            <p>Find the jobs that inspire you and build the career you’ve always dreamed of.</p>
          </div>
          <div className="explore-btn">
            <Link to="/job">Explore More <span><img src="assets/images/icon/explore-elliose.svg" alt /></span></Link>
          </div>
        </div>
      </div>
      <div className="row g-4">
         {jobs.slice(0, 6).map((job) => (
        <div className="col-xl-4 col-lg-6">
          <div className="feature-card">
            <div className="company-area">
              <div className="logo">
                <img src={`http://localhost:6102/api/image/${job.companyId?.logo}`} alt={job.companyId?.name} 
                style={{width:"60px",borderRadius:"30px"}}
                />
              </div>
              <div className="company-details">
                <div className="name-location">
                  <h5><a href="">{job.jobTitle}</a></h5>
                  <p>{job.jobType}</p>
                </div>
                {/* <div className="bookmark">
                  <i className="bi bi-bookmark" />
                </div> */}
              </div>
            </div>
            <div className="job-discription">
              <ul>
                <li>
                  <img src="assets/images/icon/arrow2.svg" alt />
                  <p><span className="title">Salary:</span> ₹{job.salaryRange?.min} - ₹{job.salaryRange?.max} / <span className="time">Per month</span></p>
                </li>
                <li>
                  <img src="assets/images/icon/arrow2.svg" alt />
                  <p><span className="title">Deadline:</span> <span>{" "}
                            {new Date(job.deadline).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            }).replace(/ (\d{4})$/, ', $1')}</span></p>
                </li>
              </ul>
            </div>
            <div className="job-type-apply">
              <div className="apply-btn">
                <Link to={`/singlejob/${job._id}`}><span><img src="assets/images/icon/apply-ellipse.svg" alt /></span>Apply Now</Link>
              </div>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  </div>
  {/* ========== Home1 Featured end============= */}
  {/* ========== Home1 Work Process Start============= */}
  <div className="home1-work-process mb-120">
    <div className="container">
      <div className="row mb-60">
        <div className="col-12 d-flex justify-content-center">
          <div className="section-title1 text-center">
            <h2>JOBES Working <span>Process</span></h2>
            <p>Learn how jobs connects you with top employers and helps you grow professionally.</p>
          </div>
        </div>
      </div>
      <div className="row g-lg-4 gy-5 justify-content-center">
        <div className="col-xl-3 col-lg-4 col-sm-6">
          <div className="single-work-process one text-center">
            <div className="icon">
              <img src="assets/images/icon/account-create.svg" alt />
            </div>
            <div className="work-content">
              <h5><a href="">Account Create</a></h5>
              <p>Sign up easily to start exploring job opportunities with confidence.</p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-4 col-sm-6">
          <div className="single-work-process two text-center">
            <div className="icon">
              <img src="assets/images/icon/create-resume.svg" alt />
            </div>
            <div className="work-content">
              <h5><a href="">Create Resume</a></h5>
              <p>Build a professional resume that highlights your skills &amp; experience.</p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-4 col-sm-6">
          <div className="single-work-process one text-center">
            <div className="icon">
              <img src="assets/images/icon/job-find.svg" alt />
            </div>
            <div className="work-content">
              <h5><a href="">Find Jobs </a></h5>
              <p>Browse jobs that match your profile &amp; apply directly with a single click.</p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-4 col-sm-6">
          <div className="single-work-process two text-center">
            <div className="icon">
              <img src="assets/images/icon/job-apply.svg" alt />
            </div>
            <div className="work-content">
              <h5><a href="">Apply Jobs</a></h5>
              <p>Track your applications &amp; secure your dream job efficiently.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* ========== Home1 Work Process end============= */}


  {/* ========== Home1 Top Recruiters area Start============= */}
 <div className="home1-featured-area mb-120">
    <div className="container">
      <div className="row mb-60">
        <div className="col-12 d-flex flex-wrap align-items-end justify-content-md-between justify-content-start gap-3">
          <div className="section-title1">
            <h2>Ai Recommended <span>Job</span></h2>
            <p>Find the jobs that inspire you and build the career you’ve always dreamed of.</p>
          </div>
          <div className="explore-btn">
            <Link to="/job">Explore More <span><img src="assets/images/icon/explore-elliose.svg" alt /></span></Link>
          </div>
        </div>
      </div>
      <div className="row g-4">
        {recommendedJobs.length === 0 ? (
        <p>No job recommendations found</p>
      ) : (
         recommendedJobs.slice(0, 6).map((rjob) => (
        <div className="col-xl-4 col-lg-6">
          <div className="feature-card">
            <div className="company-area">
              <div className="logo">
                <img src={`http://localhost:6102/api/image/${rjob.companyId?.logo}`} alt={rjob.companyId?.name} 
                style={{width:"60px",borderRadius:"30px"}}
                />
              </div>
              <div className="company-details">
                <div className="name-location">
                  <h5><a href="">{rjob.jobTitle}</a></h5>
                  <p>{rjob.companyId?.name}</p>
                  <p>{rjob.jobType}</p>
                </div>
                {/* <div className="bookmark">
                  <i className="bi bi-bookmark" />
                </div> */}
              </div>
            </div>
            <div className="job-discription">
              <ul>
                <li>
                  <img src="assets/images/icon/arrow2.svg" alt />
                  <p><span className="title">Salary:</span> ₹{rjob.salaryRange?.min} - ₹{rjob.salaryRange?.max} / <span className="time">Per month</span></p>
                </li>
                <li>
                  <img src="assets/images/icon/arrow2.svg" alt />
                  <p><span className="title">Deadline:</span> <span>{" "}
                            {new Date(rjob.deadline).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            }).replace(/ (\d{4})$/, ', $1')}</span></p>
                </li>
              </ul>
            </div>
            <div className="job-type-apply">
              <div className="apply-btn">
                <Link to={`/singlejob/${rjob._id}`}><span><img src="assets/images/icon/apply-ellipse.svg" alt /></span>Apply Now</Link>
              </div>
            </div>
          </div>
        </div>
        )))}
      </div>
    </div>
  </div>
  {/* ========== Home1 Top Recruiters area end============= */}




 <div className="home1-featured-area mb-120">
    <div className="container">
      <div className="row mb-60">
        <div className="col-12 d-flex flex-wrap align-items-end justify-content-md-between justify-content-start gap-3">
          <div className="section-title1">
            <h2> <span>Jobs You May Like</span></h2>
            <p>Discover job opportunities recommended by AI based on the jobs you have viewed and your activity on the platform..</p>
          </div>
          <div className="explore-btn">
            <Link to="/job">Explore More <span><img src="assets/images/icon/explore-elliose.svg" alt /></span></Link>
          </div>
        </div>
      </div>
      <div className="row g-4">
{viewJobs.length === 0 ? (        
  <p>No recommendations yet. Start viewing jobs to get suggestions.</p>
      ) : (
         viewJobs.slice(0, 6).map((rjob) => (
        <div className="col-xl-4 col-lg-6">
          <div className="feature-card">
            <div className="company-area">
              <div className="logo">
                <img src={`http://localhost:6102/api/image/${rjob.companyId?.logo}`} alt={rjob.companyId?.name} 
                style={{width:"60px",borderRadius:"30px"}}
                />
              </div>
              <div className="company-details">
                <div className="name-location">
                  <h5><a href="">{rjob.jobTitle}</a></h5>
                  <p>{rjob.companyId?.name}</p>
                  <p>{rjob.jobType}</p>
                </div>
                {/* <div className="bookmark">
                  <i className="bi bi-bookmark" />
                </div> */}
              </div>
            </div>
            <div className="job-discription">
              <ul>
                <li>
                  <img src="assets/images/icon/arrow2.svg" alt />
                  <p><span className="title">Salary:</span> ₹{rjob.salaryRange?.min} - ₹{rjob.salaryRange?.max} / <span className="time">Per month</span></p>
                </li>
                <li>
                  <img src="assets/images/icon/arrow2.svg" alt />
                  <p><span className="title">Deadline:</span> <span>{" "}
                            {new Date(rjob.deadline).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            }).replace(/ (\d{4})$/, ', $1')}</span></p>
                </li>
              </ul>
            </div>
            <div className="job-type-apply">
              <div className="apply-btn">
                <Link to={`/singlejob/${rjob._id}`}><span><img src="assets/images/icon/apply-ellipse.svg" alt /></span>Apply Now</Link>
              </div>
            </div>
          </div>
        </div>
        )))}
      </div>
    </div>
  </div>
</div>

    </div>
  )
}
