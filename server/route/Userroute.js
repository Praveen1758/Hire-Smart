const express = require('express');
const router =express.Router();
const upload = require('../Middleware/Upload');

const {Useradd,Getuser,DeleteUser,Updateuser,Login,Userreg,logout,getUserCount,getUserById,updateUserProfile} = require('../controller/usercontroller');

router.post('/Useradd' , Useradd);
router.get('/Getuser' , Getuser);
router.get('/getUserCount' , getUserCount);
router.delete('/DeleteUser/:id', DeleteUser);
router.put('/Updateuser/:id',Updateuser);
router.post('/Login',Login);
router.post('/Userreg',Userreg);
router.post('/logout',logout);

// Get user by ID
router.get('/getUserById/:id', getUserById);

// Update user profile with multer
router.put('/update-profile/:id', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 }
]), updateUserProfile);

module.exports=router;


// router.post('/Login',(req,res) =>{
//     res.send('login success');
// });
// router.post('/Userreg',(req,res) =>{
//     res.send('Register success');
// });