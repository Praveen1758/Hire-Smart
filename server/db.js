
const mongoose = require('mongoose');

const URI = "mongodb://127.0.0.1:27017/hiresmart";

const dbConnection = async () => {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected");
    } catch (err) {
        console.error("Database connection error:", err);
    }
};

module.exports = dbConnection;
