const userSchema  = require('../Model/user');
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const SECRETE_KEY = "PLACEMENT";

const Userreg = async (req,res)=>{
    try {

        const { name, email,phone, password} = req.body;
        let checkemail = await userSchema.findOne({email:email});
       
        if(checkemail){

            console.log("Email already exists!");
            res.json({success: false, message: "Email already exists"});
        }else{

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            let newUser = await new userSchema({
                name,
                email,
                password: hashedPassword,
                phone,
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


const Login = async (req, res)=>{

    try {
        const { email, password } = req.body;
        let user = await userSchema.findOne({email:email});
        if(!user){

            // console.log("Already existed Email!");
            res.json({ success: false, message: "Invalid credential!" });
        }else{

            let checkpass = await bcrypt.compare(password, user.password);
            if(!checkpass){

                console.log("Invalid Password!");
        res.json({ success: false, message: "Invalid credential!" });
            }else{
                let userid = user.id;
                let tocken = await jsonwebtoken.sign(userid, SECRETE_KEY);
                console.log("Login successfully ");
                res.json({
                    message:"Login Successfully",
                    success: true,
                    loggedInUser: user,
                    userTocken: tocken,
                })
            }

        }
        
    } catch (error) {

        console.log("Error occurred", error);
        res.json({error: error})
        
    }

}



const User = async(req,res)=>{
    try {
        
        const data = await userSchema.find();
        console.log(data);
        res.json(data)
    } catch (error) {

        console.error("Some error Occured"+error);
        res.status(500).json("Some internal error!!!")
        
    }
}



const Delete  = async(req,res)=>{

    try {

        let data  = await userSchema.findById(req.params.id);
        if(!data){
            console.log("Data not found with this ID");
            return res.status(404).send("Data does not exists with this ID!")
        }else{
            data = await userSchema.findByIdAndDelete(req.params.id);
            console.log("Data deleted successfully...");
            res.json({"Success":true, "Deleted Data":data})
        }
        
    } catch (error) {

        console.error("Some error Occured"+error);
        res.status(500).json("Some internal error!!!")
        
    }

}


module.exports={
    Userreg, Login, User, Delete
}