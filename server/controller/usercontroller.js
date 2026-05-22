require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../model/user_model');

const SECRET_KEY = process.env.SECRET_KEY || "GOODBYE";

const Useradd = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    if (!name || !email || !phone || !address || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let checkemail = await User.findOne({ email });
    if (checkemail) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = new User({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
     
    });

    let savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      message: "New user registered successfully",
      user: savedUser,
    });

  } catch (error) {
    console.error("Error occurred", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const Getuser=async(req,res)=>{
    try{
        const user=await User.find();
        res.send(user);
    }catch(err){
        console.log(err.message);
        res.status(500).send("Issue");
    }
}

const DeleteUser = async (req, res)=> {
    try{
        let user =await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("Not found");
        }
        user = await User.findByIdAndDelete(req.params.id)
        res.json({ "success":"User Deleted", user: user })
    }
    catch (error){
        console.log(error.message);
        res.status(500).send("Error");
    }
}

const Updateuser  = async(req,res)=>{
    const {uname,uemail,uphone,uaddress}=req.body;

    try{
        const NewUser = {};
        if (uname) {NewUser.name =uname};
        if (uemail) {NewUser.email =uemail};
        if (uphone) {NewUser.phone = uphone};
        if (uaddress) {NewUser.address = uaddress };

        let user  = await User.findByIdAndUpdate(req.params.id,{
            $set: NewUser},{new :true})
            res.json({user});
        }catch(error){
            console.error(error.mesage);
            res.status(500).send("Errorrr");
        }
    }


    // const Login = async (req, res) => {
    //     try {
    //         const { email, password } = req.body;
    //         let user = await User.findOne({email:email});
    //         if(!user){
    
    //             // console.log("Already existed Email!");
    //             res.json({ success: false, message: "Invalid credential!" });
    //         }else{
    
    //             let checkpass = await bcrypt.compare(password, user.password);
    //             if(!checkpass){
    
    //                 console.log("Invalid Password!");
    //         res.json({ success: false, message: "Invalid credential!" });
    //             }else{
    //                 let userid = user.id;
    //                 let tocken = await jsonwebtoken.sign(userid, SECRET_KEY);
    //                 console.log(" Login successfully ");
    //                 res.json({
    //                     message:"Login Successfully",
    //                     success: true,
    //                     loggedInUser: user,
    //                     userTocken: tocken,
    //                 })
    //             }
    
    //         }
    //     } catch (error) {

    //         console.log("Error occurred", error);
    //         res.json({error: error})
            
    //     }
    
    // }
    const Login = async (req, res) => {
        try {
          const { email, password } = req.body;
          const user = await User.findOne({ email });
          if (!user) {
            return res.json({ success: false, message: "Invalid credential!" });
          }
      
          const checkpass = await bcrypt.compare(password, user.password);
          if (!checkpass) {
            return res.json({ success: false, message: "Invalid credential!" });
          }
      
          const userId = user._id; // Use user._id for userId
          const token = await jsonwebtoken.sign({ id: userId }, SECRET_KEY);
      
          res.json({
            message: "Login Successfully",
            success: true,
            userId, // Include userId in the response
            userToken: token,
          });
        } catch (error) {
          console.error("Error occurred", error);
          res.json({ error: error.message });
        }
      };
      
    


    const Userreg = async (req,res)=>{
        try {
    
            const { name, email,phone, password,address} = req.body;
            let checkemail = await User.findOne({email:email});
           
            if(checkemail){
    
                console.log("Email already exists!");
                res.json({success: false, message: "Email already exists"});
            }else{
    
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                let newUser = await new User({
                    name,
                    email,
                    password: hashedPassword,
                    phone,
                    address,
                });
    
                let savedUser = await newUser.save();
                console.log("New user registered Successfully");
                res.json({
                    success:true,
                    message: " new user reqistered successfully ",
                    user: savedUser,
                    
                })
    
            }
        } catch (error) {
            
            console.log("Error occurred", error);
            res.json({error: error})
    
        }
    }
    const logout = async (req, res) => {
        try {
            // Clear session data or token from client-side (optional)
            // Example: If using tokens, you might blacklist the token or remove it from client-side storage
            // Example: req.session.destroy() if using sessions
    
            // Clear the token or session here (replace with your actual implementation)
            // For example, if using JWT:
            // res.clearCookie('token'); // Clear token from cookies
            // or if using sessions:
            // req.session.destroy();
    
            // Respond with success message
            res.json({ message: 'Logged out successfully' });
    
            // Optionally, you can send an alert message to the user
            // For example, using cookies or headers to communicate back to the client
            // res.cookie('logoutMessage', 'Logged out successfully', { maxAge: 6101 }); // Example with cookies
            // res.setHeader('X-Logout-Message', 'Logged out successfully'); // Example with headers
    
        } catch (error) {
            console.error('Error logging out:', error);
            res.status(500).json({ message: 'Failed to log out' });
        }
    };
    
    const getUserCount = async (req, res) => {
      try {
        const count = await User.countDocuments();
        res.json({ count });
      } catch (err) {
        console.log(err.message);
        res.status(500).send("Issue");
      }
    };
  const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
  
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const updatedFields = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      skills: JSON.parse(req.body.skills),
      experience: JSON.parse(req.body.experience),
      education: JSON.parse(req.body.education),
    };

    // ✅ Only update resume if uploaded
    if (req.files?.resume) {
      updatedFields.resume = req.files.resume[0].filename;
    }

    // ✅ Only update profile image if uploaded
    if (req.files?.profileImage) {
      updatedFields.profileImage = req.files.profileImage[0].filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};



const UserModel= {Useradd,Getuser,updateUserProfile,getUserById,DeleteUser,Updateuser,Login,Userreg,logout,getUserCount};
module.exports = UserModel;

