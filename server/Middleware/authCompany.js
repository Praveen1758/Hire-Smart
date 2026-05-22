const Company = require('../model/Company_model'); // import Company model
const jwt = require("jsonwebtoken");
const SECRETE_KEY = "PLACEMENT";

const authCompany = async (req, res, next) => {
    const token = req.header("auth-token"); // same as your existing middleware
    if (!token) return res.status(401).send("Token not found");

    try {
        const verified = jwt.verify(token, SECRETE_KEY);

        const company = await Company.findById(verified.companyId); // get company from token
        if (!company) return res.status(401).send("Invalid token");

        if (!company.isVerified) return res.status(403).send("Your account is not verified yet");
        if (company.isBlocked) return res.status(403).send("Your account is blocked. Contact admin");

        req.company = company; // attach company info to request
        next();
    } catch (err) {
        console.log(err);
        res.status(400).send("Invalid token");
    }
};

module.exports = authCompany;
