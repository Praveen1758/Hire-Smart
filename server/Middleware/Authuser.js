const jwt = require("jsonwebtoken");
const SECRETE_KEY = "PLACEMENT";

const authUser = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send("Token not found");
    }

    try {
        const verified = jwt.verify(token, SECRETE_KEY);
        req.user = verified;
        next();
    } catch (err) {
        console.log(err);
        res.status(400).send("Invalid token");
    }
};

module.exports = authUser;
