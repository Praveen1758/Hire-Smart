// CompanyRegister.jsx
import React, { useState,useEffect } from 'react';
import { Container, TextField, Button, Typography, Card, CardContent, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImageUrl from '../../Images/companybg.jpg'; // Adjust the path as necessary
const API_HOST = "http://localhost:6102";
const REGISTER_ENDPOINT = "/api/company/register";


const CompanyRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    description: '',
    website: '',
    // industry: '',
  });

  const [categories, setCategories] = useState([]);

useEffect(() => {
  axios.get(`${API_HOST}/api/category/Getcategory`)
    .then(res => setCategories(res.data))
    .catch(err => console.error(err));
}, []);

  const [message, setMessage] = useState('');
const [logo, setLogo] = useState(null);
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
const handleFileChange = (e) => {
  setLogo(e.target.files[0]);
};
const handleSubmit = async (e) => {
  e.preventDefault();
  const form = new FormData();
  form.append('name', formData.name);
  form.append('email', formData.email);
  form.append('password', formData.password);
  form.append('phone', formData.phone);
  form.append('description', formData.description);
  // form.append('industry', formData.industry);
  form.append('website', formData.website);
  if (logo) {
    form.append('logo', logo);
  }

  try {
    const response = await axios.post(`${API_HOST}${REGISTER_ENDPOINT}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (response.data.success) {
      alert(response.data.message);
      navigate('/Company/');
    } else {
      setMessage(response.data.message);
    }
  } catch (error) {
    setMessage(error.response?.data?.message || 'Registration failed');
  }
};

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Card sx={{ width: 400, padding: 3, bgcolor: 'rgba(255,255,255,0.95)' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>Company Registration</Typography>
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Company Name" name="name" value={formData.name} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} margin="normal" />
              {/* <TextField
            select
            fullWidth
            label="Select Industry"
            name="industry"
            value={formData.industry || ''}
            onChange={handleChange}
            margin="normal"
          >
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </TextField> */}

              <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} margin="normal" multiline />
              <TextField fullWidth label="Website" name="website" value={formData.website} onChange={handleChange} margin="normal" />
              {/* <TextField fullWidth label="Website" name="website" value={formData.website} onChange={handleChange} margin="normal" /> */}

{/* Logo Upload Field */}
<Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
  Upload Logo
  <input type="file" hidden onChange={handleFileChange} />
</Button>
{logo && <Typography variant="body2" sx={{ mt: 1 }}>{logo.name}</Typography>}

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Register</Button>
            </form>
            {message && <Typography color="error" variant="body2">{message}</Typography>}
            <Typography variant="body2" sx={{ mt: 3 }}>
              Already have an account?{' '}
              <Button
                variant="text"
                onClick={() => navigate('/Company/')}
                sx={{ textTransform: 'none', fontWeight: 'bold', padding: 0, minWidth: 0 }}
              >
                Login
              </Button>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CompanyRegister;
