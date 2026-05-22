const AdminModel = require('../model/Admin_model');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || "MADPEOPLE";

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required!" });
        }

        let admin = await AdminModel.findOne({ email });
        if (!admin) {
            return res.json({ success: false, message: "Invalid credentials!" });
        }

        const storedPassword = admin.password || "";
        const isHashedPassword = storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$");
        const isPasswordValid = isHashedPassword
            ? await bcrypt.compare(password, storedPassword)
            : password === storedPassword;

        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid credentials!" });
        }

        let token = jsonwebtoken.sign({ id: admin._id }, SECRET_KEY);
        return res.json({
            message: "Login Successfully",
            success: true,
            loggedInAdmin: admin,
            adminToken: token,
        });
    } catch (error) {
        console.log("Error occurred", error);
        return res.json({ error: error });
    }
}


module.exports = { Login };
