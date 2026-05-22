import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Box, Grid, TextField, Snackbar, Alert, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function ViewCategory() {
    const host = config.host;

    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        axios.get(`${host}/api/Category/GetCategory`)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [host]);

    const handleOpen = (category) => {
        setSelectedCategory(category);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCategory(null);
    };

const handleUpdate = () => {
  const formData = new FormData();
  formData.append('category_name', selectedCategory.category_name);
  formData.append('category_description', selectedCategory.category_description);

  if (selectedCategory.category_image instanceof File) {
    formData.append('category_image', selectedCategory.category_image);
  }

  axios.put(
    `${host}/api/Category/UpdateCategory/${selectedCategory._id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  .then((res) => {
    setData(prev =>
      prev.map(cat =>
        cat._id === selectedCategory._id ? res.data.category : cat
      )
    );
    handleClose();
    setSnackbarMessage('Category updated successfully');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  })
  .catch((err) => {
    console.log(err);
    setSnackbarMessage('Failed to update category');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  });
};


    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            axios.delete(`${host}/api/Category/DeleteCategory/${id}`)
                .then((res) => {
                    setData((prevData) => prevData.filter(cat => cat._id !== id));
                    setSnackbarMessage('Category deleted successfully');
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);
                })
                .catch((err) => {
                    console.log(err);
                    setSnackbarMessage('Failed to delete category');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedCategory(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <TableContainer component={Paper}>
                <Table style={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
  <TableRow>
    <TableCell 
      sx={{ 
        color: '#19334d', // Coffee brown color
        fontSize: '16px', // Font size
        fontWeight: 'bold', // Bold text
        borderBottom: '2px solid #19334d' // Optional: Add a bottom border to match the color
      }}
    >
      Category Name
    </TableCell>
    <TableCell 
      sx={{ 
        color: '#19334d', // Coffee brown color
        fontSize: '16px', // Font size
        fontWeight: 'bold', // Bold text
        borderBottom: '2px solid #19334d' // Optional: Add a bottom border to match the color
      }}
    >
      Category Description
    </TableCell>
    <TableCell 
      sx={{ 
        color: '#19334d', // Coffee brown color
        fontSize: '16px', // Font size
        fontWeight: 'bold', // Bold text
        borderBottom: '2px solid #19334d' // Optional: Add a bottom border to match the color
      }}
    >
      Category Date
    </TableCell>
    <TableCell 
      sx={{ 
        color: '#19334d', // Coffee brown color
        fontSize: '16px', // Font size
        fontWeight: 'bold', // Bold text
        borderBottom: '2px solid #19334d' // Optional: Add a bottom border to match the color
      }}
    >
      Category Image
    </TableCell>
    <TableCell 
      sx={{ 
        color: '#19334d', // Coffee brown color
        fontSize: '16px', // Font size
        fontWeight: 'bold', // Bold text
        borderBottom: '2px solid #19334d' // Optional: Add a bottom border to match the color
      }}
    >
      Action
    </TableCell>
  </TableRow>
</TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.category_name}</TableCell>
                                <TableCell>{item.category_description}</TableCell>
                                <TableCell>{new Date(item.category_date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <img src={`${host}/api/image/${item.category_image}`} alt={item.category_name} style={{ maxWidth: '100px', maxHeight: '100px'}} />
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpen(item)}><EditIcon /></Button>
                                    <Button onClick={() => handleDelete(item._id)}><DeleteOutlineIcon /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...modalStyle, backgroundColor: 'white', width: 700 }}>
                    <Typography variant="h6" id="modal-modal-title" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                        Update Category
                    </Typography>
                    <TextField
                        label="Category Name"
                        name="category_name"
                        value={selectedCategory?.category_name || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Category Description"
                        name="category_description"
                        value={selectedCategory?.category_description || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                    type="file"
                    onChange={(e) =>
                        setSelectedCategory({
                        ...selectedCategory,
                        category_image: e.target.files[0]
                        })
                    }
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                        <Button onClick={handleUpdate} variant="contained" color="primary" style={{ marginLeft: '10px' }}>
                            Update
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #000',
    boxShadow: 24,
    padding: '20px',
};
