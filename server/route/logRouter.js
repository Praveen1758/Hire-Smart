const express = require("express");
const router = express.Router();
const { createLog } = require("../controller/logController");
// const auth = require("../Middleware/authMiddleware"); // middleware for JWT

router.post("/insert/:userId", createLog);

module.exports = router;
