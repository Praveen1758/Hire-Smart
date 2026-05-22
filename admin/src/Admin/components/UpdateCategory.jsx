// import React, { useState, useEffect } from 'react';
// import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
// import axios from 'axios';

// const UpdateCategory = ({ open, handleClose, category, fetchCategories }) => {
//   const [name, setName] = useState('');

//   useEffect(() => {
//     if (category) {
//       setName(category.name);
//     }
//   }, [category]);

//   const handleSubmit = async () => {
//     try {
//       await axios.put(`http://localhost:6101/api/categories/update/${category._id}`, { name });
//       fetchCategories();
//       handleClose();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={handleClose}>
//       <DialogTitle>Update Category</DialogTitle>
//       <DialogContent>
//         <TextField
//           label="Category Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           fullWidth
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose} color="primary">
//           Cancel
//         </Button>
//         <Button onClick={handleSubmit} color="primary">
//           Update
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default UpdateCategory;
