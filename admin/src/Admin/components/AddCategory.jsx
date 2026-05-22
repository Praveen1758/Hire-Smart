import React, { useState } from 'react';
import { Paper, Typography, Box, TextField, Button, Grid } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddCategory() {
  const API_HOST = "http://localhost:6102";
  const API_ENDPOINT = "/api/category/AddCategory";
  const navigate = useNavigate();

  const [data, setData] = useState({
    category_name: '',
    category_description: ''
  });
  const [image, setImage] = useState('');

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };


  
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('category_name', data.category_name);
    formData.append('category_description', data.category_description);
    formData.append('category_image', image);

    axios.post(`${API_HOST}${API_ENDPOINT}`, formData)
      .then((res) => {
        console.log(res.data); // Log response if needed
        alert("Category added successfully!"); // Show alert message
        setData({ // Clear form fields after successful submission
          category_name: '',
          category_description: '',
        });
        setImage(''); // Clear image selection
         navigate('/ViewCategory');
      })
      .catch((err) => {
        console.error("There was an error submitting the form!", err);
        // Optionally handle error scenarios with alerts or other UI feedback
      });
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', margin:"150px" }}>
      <Grid container justifyContent="center">
        <Grid item lg={12}>
          <Paper elevation={10} sx={{ p: 3 }}>
            <Typography
              sx={{ 
                color: '#19334d', // Coffee brown color for category name
                mb: 4, 
                fontFamily: 'Arial, sans-serif', 
                fontWeight: 'bold' 
              }}
              variant="h3" 
              component="h1" 
              align='center'
            >
              Add Category
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  id="categoryname"
                  onChange={handleChange}
                  value={data.category_name}
                  label="Enter Your Category Name"
                  name="category_name"
                  variant="outlined"
                  size="large"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="categoryimage"
                  onChange={handleFileChange}
                  name="category_image"
                  variant="outlined"
                  fullWidth
                  type="file"
                />
              </Grid>
            </Grid>
            <TextField
              id="cdescription"
              onChange={handleChange}
              value={data.category_description}
              label="Enter Your Category Description"
              name="category_description"
              type="text"
              variant="outlined"
              size="large"
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            <Button
              variant="outlined"
              onClick={handleSubmit}
              fullWidth
              sx={{ 
                mt: 2, 
                color: 'white', 
                borderColor: '#6f4f28', 
                padding: '10px',
                width: '200px',
                background: 'linear-gradient(to left,white, black)', // Gradient from coffee brown to dark brown
                borderRadius: '4px', // Optional: adjust the border radius
                '&:hover': {
                  background:'linear-gradient(to left,white, black)', // Keep the gradient on hover
                  borderColor: '#6f4f28'
                }
              }} 
            >
              Submit
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
