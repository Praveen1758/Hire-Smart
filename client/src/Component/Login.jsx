import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const API_HOST = "http://localhost:6102";
  const API_ENDPOINT = "/api/user/Login";
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});


  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loginSuccess, setLoginSuccess] = useState(false);


    const validate = () => {
  let tempErrors = {};

  if (!formData.email.trim()) {
    tempErrors.email = 'Email is required';
  }

  if (!formData.password.trim()) {
    tempErrors.password = 'Password is required';
  }

  setErrors(tempErrors);
  return Object.keys(tempErrors).length === 0;
};
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //     if (!validate()) return;   //  stop submit if invalid

  //   setLoading(true);
  //   setMessage({ type: '', text: '' });

  //   axios.post(`${API_HOST}${API_ENDPOINT}`, formData)
  //     .then((res) => {
  //       if (res.data.success) {
  //         localStorage.setItem('userToken', res.data.userToken);
  //         localStorage.setItem('userId', res.data.userId);

  //         setMessage({ type: 'success', text: 'Login successful!' });
  //         setLoginSuccess(true);
  //       } else {
  //         setMessage({ type: 'error', text: res.data.message });
  //       }
  //     })
  //     .catch(() => {
  //       setMessage({ type: 'error', text: 'There was an error logging in!' });
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };


    const handleSubmit = (e) => {
    e.preventDefault();
      if (!validate()) return;   //  stop submit if invalid

    setLoading(true);
    setMessage({ type: '', text: '' });
axios.post(`${API_HOST}${API_ENDPOINT}`, formData)
  .then(async (res) => {
    if (res.data.success) {
      localStorage.setItem('userToken', res.data.userToken);
      localStorage.setItem('userId', res.data.userId);

      // 🔹 Fetch user info immediately after login
      try {
        const userRes = await axios.get(`${API_HOST}/api/user/getUserById/${res.data.userId}`);
        const user = userRes.data.user;
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userProfile', user.profileImage);

        // 🔹 Trigger header update
        window.dispatchEvent(new Event('profileUpdated'));

      } catch (err) {
        console.error('Error fetching user data after login', err);
      }

      setMessage({ type: 'success', text: 'Login successful!' });
      setLoginSuccess(true);
    } else {
      setMessage({ type: 'error', text: res.data.message });
    }
  })
  .catch(() => {
    setMessage({ type: 'error', text: 'There was an error logging in!' });
  })
  .finally(() => {
    setLoading(false);
  });

    }
    
  useEffect(() => {
    if (loginSuccess) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, navigate]);



  return (
    <div style={{
    backgroundImage: "url('/assets/images/companybg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    width: "100%"

    }}>
    <div className="login-area pt-120 mb-120">
    <div className="container">
        <div className="row">
        <div className="col-lg-12">
            <div className="form-wrapper">
            <div className="form-title">
                <h3>Welcome Back!</h3>
                <span />
            </div>
            {message.text && (
                <div
                    style={{
                    marginBottom: '20px',
                    padding: '10px',
                    borderRadius: '5px',
                    color: message.type === 'success' ? 'green' : 'red',
                    backgroundColor: message.type === 'success' ? '#e6ffe6' : '#ffe6e6',
                    textAlign: 'center',
                    fontWeight: '500',
                    }}
                >
                    {message.text}
                </div>
                )}
            <form onSubmit={handleSubmit}>
                <div className="row">
                  <p style={{textAlign:"center", fontWeight:"bold", fontSize:"20px",marginBottom:"30px"}}>Login to discover opportunities</p>
                <div className="col-lg-12">
                    <div className="form-inner mb-25">
                    <label htmlFor="email">Email*</label> 
                    <div className="input-area">
                        <img src="assets/images/icon/email-2.svg" alt />
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="info@example.com" />
                    </div>
                        {errors.email && (
                        <small style={{ color: 'red' }}>{errors.email}</small>
                        )}

                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="form-inner">
                    <label htmlFor="email">Password*</label> 
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                    <i className="bi bi-eye-slash" id="togglePassword" />
                    </div>
                    {errors.password && (
                    <small style={{ color: 'red' }}>{errors.password}</small>
                    )}
                </div>
                <div className="col-lg-12" style={{marginTop:"40px"}}>
                    <div className="form-inner">
                    <button className="primry-btn-2" type="submit">LogIn</button>
                    </div>
                </div>
                <h6>Don’t have an account? <Link to="/register">Sign Up</Link></h6>
                </div>
            </form>
            </div>
        </div>
        </div>
    </div>
    </div>

    </div>
  )
}


// header.style-1 .main-menu ul > li:hover > a