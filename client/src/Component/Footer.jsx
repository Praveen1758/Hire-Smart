import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <div>
      <footer className="footer1">
        <div className="container">
           {/* <h2>HIRE SMART</h2> */}
          <div className="row justify-content-center">


            {/* About Us */}
            <div className="col-lg-3 col-md-4 col-sm-6 mb--50 d-flex justify-content-sm-start justify-content-center">
              <div className="footer-widget">
                <div className="widget-title">
                  <h5>About Us</h5>
                </div>
                <div className="menu-container">
                  <ul>
                    <li><Link to="/About">About Platform <i className="bx bx-up-arrow-alt" /></Link></li>
                    <li><Link to="/">Privacy Policy <i className="bx bx-up-arrow-alt" /></Link></li>
                    <li><Link to="/">Terms & Conditions <i className="bx bx-up-arrow-alt" /></Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Find Jobs */}
            <div className="col-lg-3 col-md-4 col-sm-6 mb--50 d-flex justify-content-md-center justify-content-sm-end justify-content-center">
              <div className="footer-widget">
                <div className="widget-title">
                  <h5>Find Jobs</h5>
                </div>
                <div className="menu-container">
                  <ul>
                    <li><Link to="/job">Apply Jobs <i className="bx bx-up-arrow-alt" /></Link></li>
                    <li><Link to="/">Recommended Jobs <i className="bx bx-up-arrow-alt" /></Link></li>
                    <li><Link to="/">Job Categories <i className="bx bx-up-arrow-alt" /></Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-3 col-md-4 col-sm-6 mb--50 d-flex justify-content-lg-center justify-content-md-end justify-content-sm-start justify-content-center">
              <div className="footer-widget">
                <div className="widget-title">
                  <h5>Quick Links</h5>
                </div>
                <div className="menu-container">
                  <ul>
                    <li><Link to="/Login">User Login <i className="bx bx-up-arrow-alt" /></Link></li>
                    <li><Link to="/Register">Register <i className="bx bx-up-arrow-alt" /></Link></li>
                    <li><Link to="/Profile">User Profile <i className="bx bx-up-arrow-alt" /></Link></li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section */}
          <div className="footer-btm">
            <div className="row border-top align-items-center">
              <div className="col-lg-6 d-flex justify-content-lg-start justify-content-center">
                <div className="copyright-area">
                  <p>
                    © {new Date().getFullYear()} <a href="#">Job Recommendation System</a>
                  </p>
                </div>
              </div>

              <div className="col-lg-6 d-flex justify-content-lg-end justify-content-center">
                <div className="social-area">
                  <h6>Follow Us:</h6>
                  <ul>
                    <li><a href="#"><i className="bx bxl-facebook" /></a></li>
                    <li><a href="#"><i className="bx bxl-twitter" /></a></li>
                    <li><a href="#"><i className="bx bxl-linkedin" /></a></li>
                    <li><a href="#"><i className="bx bxl-instagram" /></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </div>
  )
}
