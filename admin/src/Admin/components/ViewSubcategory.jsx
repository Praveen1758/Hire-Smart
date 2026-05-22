import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, 
    Modal, Box, Grid, TextField, Snackbar, Alert, Typography, IconButton, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function ViewSubcategory() {
    const host = config.host;

    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        axios.get(`${host}/api/SubCategory/GetSubcategories`)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
            
        axios.get(`${host}/api/Category/GetCategory`) // Fetch categories
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [host]);

const handleOpen = (subcategory) => {
  setSelectedSubcategory(subcategory); // keep category as object
  setOpen(true);
};


    const handleClose = () => {
        setOpen(false);
        setSelectedSubcategory(null);
    };

const handleUpdate = () => {
const payload = {
  subcategory_name: selectedSubcategory.subcategory_name,
  subcategory_description: selectedSubcategory.subcategory_description,
  category: selectedSubcategory.category._id
};


  axios
    .put(
      `${host}/api/SubCategory/UpdateSubcategory/${selectedSubcategory._id}`,
      payload
    )
    .then((res) => {
      const populatedSubcategory = res.data.subcategory; // 👈 populated
      console.log("UPDATED:", res.data.subcategory);


      setData(prev =>
        prev.map(sub =>
          sub._id === populatedSubcategory._id
            ? populatedSubcategory
            : sub
        )
      );

      handleClose();
      setSnackbarMessage('Subcategory updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    })
    .catch((err) => {
      console.log(err);
      setSnackbarMessage('Failed to update subcategory');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    });
};



    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this subcategory?')) {
            axios.delete(`${host}/api/SubCategory/DeleteSubcategory/${id}`)
                .then((res) => {
                    setData((prevData) => prevData.filter(sub => sub._id !== id));
                    setSnackbarMessage('Subcategory deleted successfully');
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);
                })
                .catch((err) => {
                    console.log(err);
                    setSnackbarMessage('Failed to delete subcategory');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedSubcategory(prevState => ({
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
      Subcategory Name
    </TableCell>
    <TableCell
      sx={{
        color: '#19334d', // Coffee brown color
        fontSize: '16px', // Font size
        fontWeight: 'bold', // Bold text
        borderBottom: '2px solid #19334d' // Optional: Add a bottom border to match the color
      }}
    >
      Subcategory Description
    </TableCell>
    <TableCell
      sx={{
        color: '#19334d', // Coffee brown color
        fontSize: '16px', // Font size
        fontWeight: 'bold', // Bold text
        borderBottom: '2px solid #19334d' // Optional: Add a bottom border to match the color
      }}
    >
      Category
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
                                <TableCell>{item.subcategory_name}</TableCell>
                                <TableCell>{item.subcategory_description}</TableCell>
                                <TableCell>
                                {item.category?.category_name || 'N/A'}
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
                <Box sx={{ ...modalStyle, backgroundColor: 'white', width: 500 }}>
                    <Typography variant="h6" id="modal-modal-title" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                        Update Subcategory
                    </Typography>
                    <TextField
                        label="Subcategory Name"
                        name="subcategory_name"
                        value={selectedSubcategory?.subcategory_name || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Subcategory Description"
                        name="subcategory_description"
                        value={selectedSubcategory?.subcategory_description || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="select-category-label">Category</InputLabel>
             <Select
  labelId="select-category-label"
  name="category"
  value={selectedSubcategory?.category?._id || ''} // use _id for value
  onChange={(e) => {
    const selectedCat = categories.find(cat => cat._id === e.target.value);
    setSelectedSubcategory(prev => ({
      ...prev,
      category: selectedCat // store the full object
    }));
  }}
>
  {categories.map((category) => (
    <MenuItem key={category._id} value={category._id}>
      {category.category_name}
    </MenuItem>
  ))}
</Select>

                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Button onClick={handleUpdate} variant="contained" color="primary">
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
