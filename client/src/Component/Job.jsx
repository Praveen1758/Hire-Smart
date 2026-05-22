import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ChatWidget from './ChatWidget';

export default function Job() {
  const [jobs, setJobs] = useState([]);
  const [jobType, setJobType] = useState(""); // selected type

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 4;

  // Fetch all jobs
  const fetchJobs = (categoryId = null) => {
    let url = 'http://localhost:6102/api/jobs/getAllJobPostings';
    if (categoryId) {
      url += `?category=${categoryId}`; // pass category as query param
    }
    axios.get(url)
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchJobs(); // fetch all jobs initially
  }, []);

  // Fetch categories
  useEffect(() => {
    axios.get('http://localhost:6102/api/category/Getcategory')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  // Handle category click
const handleCategorySelect = (id) => {
  setSelectedCategory(id);
  setJobType("");      // 🔴 RESET JOB TYPE
  fetchJobs(id);
};
const filteredJobs = jobType
  ? jobs.filter(job => job.jobType === jobType)
  : jobs;

const indexOfLastJob = currentPage * jobsPerPage;
const indexOfFirstJob = indexOfLastJob - jobsPerPage;
const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

useEffect(() => {
  setCurrentPage(1);
}, [jobType, selectedCategory]);


const timeAgo = (date) => {
  const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
  return `${diff} day${diff !== 1 ? 's' : ''} ago`;
};

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
            <h1>Job Listing</h1>
            <span />
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Job Listing</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* ========== Inner Banner end============= */}
  {/* ========== Job Listing Start============= */}
  <div className="job-listing-area pt-120 mb-120">
    <div className="container">
      <div className="row g-lg-4 gy-5">
        <div className="col-lg-4 order-lg-1 order-2">
          <div className="job-sidebar">
            <div className="job-widget style-1 mb-20">
              <div className="check-box-item">
                <h5 className="job-widget-title">Job Category</h5>
                <div className="checkbox-container">
                    <ul>
                        {categories.map(cat => (
                        <li key={cat._id}>
                            <label className="containerss">
                            <input 
                                type="radio" 
                                name="category"
                                checked={selectedCategory === cat._id}
                                onChange={() => handleCategorySelect(cat._id)}
                            />
                            <span className="checkmark" />
                            <span className="text">{cat.category_name}</span>
                            {/* <span className="qty">({cat.jobCount || 0})</span> */}
                            </label>
                        </li>
                        ))}
                    </ul>
                </div>
              </div>
            </div>
            <div className="job-widget mb-20">
              <div className="check-box-item">
                <h5 className="job-widget-title">Type of Employments</h5>
            <div className="checkbox-container">
            <ul>

                <li>
                <label className="containerss">
                    <input
                    type="radio"
                    name="jobType"
                    checked={jobType === "Full-Time"}
                    onChange={() => setJobType("Full-Time")}
                    />
                    <span className="checkmark" />
                    <span className="text">Full Time</span>
                </label>
                </li>

                <li>
                <label className="containerss">
                    <input
                    type="radio"
                    name="jobType"
                    checked={jobType === "Part-Time"}
                    onChange={() => setJobType("Part-Time")}
                    />
                    <span className="checkmark" />
                    <span className="text">Part Time</span>
                </label>
                </li>

                <li>
                <label className="containerss">
                    <input
                    type="radio"
                    name="jobType"
                    checked={jobType === "Internship"}
                    onChange={() => setJobType("Internship")}
                    />
                    <span className="checkmark" />
                    <span className="text">Internship</span>
                </label>
                </li>

                <li>
                <label className="containerss">
                    <input
                    type="radio"
                    name="jobType"
                    checked={jobType === "Contract"}
                    onChange={() => setJobType("Contract")}
                    />
                    <span className="checkmark" />
                    <span className="text">Contract</span>
                </label>
                </li>

                <li>
                <label className="containerss">
                    <input
                    type="radio"
                    name="jobType"
                    checked={jobType === "Remote"}
                    onChange={() => setJobType("Remote")}
                    />
                    <span className="checkmark" />
                    <span className="text">Remote</span>
                </label>
                </li>

            </ul>
            </div>

              </div>
            </div>
            {/* <div className="job-widget mb-20">
              <div className="check-box-item">
                <h5 className="job-widget-title">Date of Post</h5>
                <div className="checkbox-container">
                  <ul>
                    <li>
                      <label className="containerss">
                        <input type="checkbox" />
                        <span className="checkmark" />
                        <span className="text">Today</span>
                        <span className="qty">(80)</span>
                      </label>
                    </li>
                    <li>
                      <label className="containerss">
                        <input type="checkbox" />
                        <span className="checkmark" />
                        <span className="text">Last week ago</span>
                        <span className="qty">(100)</span>
                      </label>
                    </li>
                    <li>
                      <label className="containerss">
                        <input type="checkbox" />
                        <span className="checkmark" />
                        <span className="text">Last month ago</span>
                        <span className="qty">(100)</span>
                      </label>
                    </li>
                    <li>
                      <label className="containerss">
                        <input type="checkbox" />
                        <span className="checkmark" />
                        <span className="text">3 month ago</span>
                        <span className="qty">(30)</span>
                      </label>
                    </li>
                    <li>
                      <label className="containerss">
                        <input type="checkbox" />
                        <span className="checkmark" />
                        <span className="text">1 year ago</span>
                        <span className="qty">(30)</span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}
            {/* <div className="job-widget mb-20">
              <div className="check-box-item">
                <h5 className="job-widget-title mb-15">Salary Range</h5>
                <div className="range-wrap">
                  <div className="slider-labels">
                    <div className="caption">
                      <span id="slider-range-value1" />K
                    </div>
                    -
                    <div className="text-right caption">
                      <span id="slider-range-value2" />K
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <form>
                        <input type="hidden" name="min-value" defaultValue />
                        <input type="hidden" name="max-value" defaultValue />
                      </form>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <div id="slider-range" />
                    </div>
                  </div>
                </div>
                <div className="salary-container">
                  <ul>
                    <li>
                      <input className="form-check-input" type="radio" id="salary-1" name="showInputBox" defaultValue="salary-1" />
                      <div className="content">
                        <span className="text">$5K-$15K</span>
                        <span className="qty">(80)</span>
                      </div>
                    </li>
                    <li>
                      <input className="form-check-input" type="radio" id="salary-2" name="showInputBox" defaultValue="salary-2" />
                      <div className="content">
                        <span className="text">$20K-$30K</span>
                        <span className="qty">(100)</span>
                      </div>
                    </li>
                    <li>
                      <input className="form-check-input" type="radio" id="salary-3" name="showInputBox" defaultValue="salary-3" />
                      <div className="content">
                        <span className="text">$35K-$50K</span>
                        <span className="qty">(100)</span>
                      </div>
                    </li>
                    <li>
                      <input className="form-check-input" type="radio" id="salary-4" name="showInputBox" defaultValue="salary-4" />
                      <div className="content">
                        <span className="text">$55K-$70K</span>
                        <span className="qty">(120)</span>
                      </div>
                    </li>
                    <li>
                      <input className="form-check-input" type="radio" id="salary-5" name="showInputBox" defaultValue="salary-5" />
                      <div className="content">
                        <span className="text">$75K-$100K</span>
                        <span className="qty">(30)</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="job-widget mb-20">
              <div className="check-box-item">
                <h5 className="job-widget-title mb-10">Date of Post</h5>
                <ul className="tags">
                  <li><a href="job-listing1.html">Technology,</a></li>
                  <li><a href="job-listing1.html">Marketing,</a></li>
                  <li><a href="job-listing1.html">Sales,</a></li>
                  <li><a href="job-listing1.html">Transport,</a></li>
                  <li><a href="job-listing1.html">Medical,</a></li>
                  <li><a href="job-listing1.html">Design,</a></li>
                  <li><a href="job-listing1.html">Data Analyst,</a></li>
                  <li><a href="job-listing1.html">Development,</a></li>
                  <li><a href="job-listing1.html">Non-Profit,</a></li>
                  <li><a href="job-listing1.html">Manager,</a></li>
                  <li><a href="job-listing1.html">Health,</a></li>
                </ul>
              </div>
            </div> */}
          </div>
        </div>
        <div className="col-lg-8 order-lg-2 order-1">
          <div className="job-listing-wrrap">
            <div className="row g-4 mb-25">
              <div className="col-lg-6 d-flex align-items-center">
                <p className="show-item">Showing jobs list</p>
              </div>
            </div>
            <div className="row ">
              <div className="col-lg-12 mb-30">
                {currentJobs.map((job) => (
                <div className="job-listing-card mb-30" key={job._id}>
                    <div className="job-top">
                    <div className="job-list-content">
                        <div className="company-area">
                        <div className="logo">
                            <img
                            src={`http://localhost:6102/api/image/${job.companyId?.logo}`}
                            style={{ width: 100, height: 100, objectFit: "contain" ,borderRadius:"30px"}}
                            alt={job.companyId?.name}
                            />
                        </div>

                        <div className="company-details">
                            <div className="name-location">
                            <h5 style={{color:"black"}}>{job.jobTitle}</h5>
                            <p>{job.companyId?.name}</p>
                            </div>
                        </div>
                        </div>

                        <div className="job-discription">
                        <ul>
                            <li>
                            <span className="title" style={{fontWeight:"bold"}}>Salary:</span> ₹{job.salaryRange?.min} - ₹{job.salaryRange?.max}/per Month
                            </li>
                            <li>
                            <span className="title" style={{fontWeight:"bold"}}>Deadline: </span>{" "}
                            {new Date(job.deadline).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            }).replace(/ (\d{4})$/, ', $1')}   </li>
                        </ul>
                        </div>
                    </div>

                    <div className="">
                        {timeAgo(job.postedDate)}
                    </div>
                    </div>

                    <div className="job-type-apply">
                    <div className="job-type">
                        <span
                        className={
                            job.jobType === "Full-Time"
                            ? "light-green"
                            : job.jobType === "Part-Time"
                            ? "light-purple"
                            : job.jobType === "Remote"
                            ? "light-blue"
                            : ""
                        }
                        >
                        {job.jobType}
                        </span>
                    </div>

                    <div className="apply-btn">
                        <Link to={`/singlejob/${job._id}`}>Apply Now</Link>
                    </div>
                    </div>
                </div>
                ))}

{totalPages > 1 && (
  <div className="col-lg-12 d-flex justify-content-center">
    <div className="pagination-area">
      <nav aria-label="Page navigation">
        <ul className="pagination">

          {/* Previous */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>
          </li>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(index + 1)}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            </li>
          ))}

          {/* Next */}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </li>

        </ul>
      </nav>
    </div>
  </div>
)}


                </div>
                </div>
          </div>
        </div>  
      </div>
    </div>
  </div>
  {/* ========== Job Listing e nd============= */}
</div>

    </div>
  )
}

