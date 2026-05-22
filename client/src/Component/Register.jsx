import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Register() {

    const API_HOST = "http://localhost:6102";
  const API_ENDPOINT = "/api/user/Useradd";
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    isWillingToPay: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const validate = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value) error = 'Name is required';
        else if (!/^[a-zA-Z0-9\s]+$/.test(value)) error = 'Only letters and spaces allowed';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        break;
      case 'phone':
        if (!value) error = 'Phone number is required';
        else if (!/^\d{10}$/.test(value)) error = 'Must be 10 digits';
        break;
      case 'address':
        if (!value) error = 'Address is required';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Min 6 characters required';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validate(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = Object.keys(formData).every((key) =>
      validate(key, formData[key])
    );
    if (!isValid) {
      setMessage({ type: 'error', text: 'Please fix the form errors' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    axios
      .post(`${API_HOST}${API_ENDPOINT}`, formData)
      .then((res) => {
        setMessage({ type: 'success', text: 'Registration successful!' });
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          password: '',
        });
        setErrors({});
        setTimeout(() => {
        navigate('/login');
    }, 2000);
      })
      .catch((err) => {
        setMessage({
          type: 'error',
          text: 'There was an error submitting the form!',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div style={{
    backgroundImage: "url('/assets/images/companybg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    width: "100%"
    }}>
      
    <div className="login-area pt-120 pb-120">
    <div className="container">
        <div className="row">
        <div className="col-lg-12">
            <div className="form-wrapper">
            <div className="form-title">
                <h3>Create Your Account!</h3>
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
                <p style={{textAlign:"center", fontWeight:"bold", fontSize:"20px",marginBottom:"30px"}}>Register to explore new opportunities</p>
              <div className="col-lg-12">
                    <div className="form-inner mb-25">
                    <label htmlFor="email">Full Name*</label> 
                    <div className="input-area">
                        <img src="assets/images/icon/user-2.svg" alt />
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" />
                    </div>
                    {errors.name && (
                    <small style={{ color: 'red' }}>{errors.name}</small>
                    )}
                    </div>
                </div>
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
                    <div className="form-inner mb-25">
                    <label htmlFor="email">Phone*</label> 
                    <div className="input-area">
                        <img src="assets/images/icon/phone-5.svg" alt />
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" />
                    </div>
                     {errors.phone && (
                    <small style={{ color: 'red' }}>{errors.phone}</small>
                    )}
                    </div>
                </div>
                   <div className="col-lg-12">
                    <div className="form-inner mb-25">
                    <label htmlFor="email">Address*</label> 
                    <div className="input-area">
                        <img src="assets/images/icon/home-2.svg" alt />
                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                    </div>
                    {errors.address && (
                    <small style={{ color: 'red' }}>{errors.address}</small>
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
                    <button className="primry-btn-2" type="submit">Register</button>
                    </div>
                </div>
                <h6>Don’t have an account? <Link to="/login">Sign in</Link></h6>
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
