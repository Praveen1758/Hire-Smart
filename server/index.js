const express = require('express');
const cors = require('cors');
const dbConnection = require('./db');

const app = express();
const PORTNO = 6102;
app.use(cors());
app.use(express.json());

dbConnection();

app.get('/hai', (req, res) => {
    res.send("hello");
});

app.use("/api/user", require('./route/Userroute'));
app.use("/api/Category", require('./route/Categoryroute'));
app.use("/api/company", require('./route/Companyroute'));
app.use('/api/payment',  require('./route/PaymentRoute'));
app.use('/api/feedback',  require('./route/feedbackRoute'));
app.use("/api/SubCategory", require('./route/SubCategoryroute'));
app.use("/api/jobs", require('./route/Jobpostingroute'));
app.use('/api/dashboard', require('./route/dashboardRoutes'));
app.use("/api/admin", require('./route/Adminroute'));
app.use("/api/application", require('./route/ApplicationRoute'));
app.use('/api/log',require('./route/logRouter'))




app.use("/api/image/", express.static("./Uploads"));


  
app.listen(PORTNO, () => {
    console.log(`Server is on portno: ${PORTNO}`);
});
