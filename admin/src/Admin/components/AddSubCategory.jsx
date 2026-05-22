
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddSubCategory() {
  const API_HOST = "http://localhost:6102";
  const API_ENDPOINT = "/api/SubCategory/AddSubcategory";
  const CATEGORY_ENDPOINT = "/api/Category/GetCategory";
  const navigate = useNavigate();

  const [data, setData] = useState({
    subcategory_name: '',
    subcategory_description: '',
    category: ''
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${API_HOST}${CATEGORY_ENDPOINT}`)
      .then((res) => {
        console.log("Fetched categories: ", res.data);
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("There was an error fetching the categories!", err);
      });
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Submitting data: ", data); // Log the data being submitted
    axios.post(`${API_HOST}${API_ENDPOINT}`, data)
      .then((res) => {
        console.log(res.data);
        alert("Subcategory added successfully!");
        setData({
          subcategory_name: '',
          subcategory_description: '',
          category: ''
        });
        navigate('/ViewSubcategory');
      })
      .catch((err) => {
        console.error("There was an error submitting the form!", err);
      });
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Grid container justifyContent="center">
        <Grid item lg={12}>
          <Paper elevation={10} sx={{ p: 3 }}>
            <Typography sx={{ color: '#19334d', mb: 4, fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }} variant="h3" component="h1" align='center'>
              Add Subcategory
            </Typography>
            <TextField
              id="subcategoryname"
              onChange={handleChange}
              value={data.subcategory_name}
              label="Enter Your Subcategory Name"
              name="subcategory_name"
              variant="outlined"
              size="large"
              fullWidth
              margin="normal"
              sx={{ color: '#6f4f28' }} // Set text color to match
            />
            <TextField
              id="subcategorydescription"
              onChange={handleChange}
              value={data.subcategory_description}
              label="Enter Your Subcategory Description"
              name="subcategory_description"
              type="text"
              variant="outlined"
              size="large"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              sx={{ color: '#6f4f28' }} // Set text color to match
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label" sx={{ color: '#6f4f28' }}>Select Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={data.category}
                onChange={handleChange}
                label="Select Category"
                sx={{ color: '#6f4f28' }} // Set text color to match
              >
                {categories.length === 0 ? (
                  <MenuItem disabled>No categories available</MenuItem>
                ) : (
                  categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.category_name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
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
                  background: 'linear-gradient(to left,white, black)', // Keep the gradient on hover
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
