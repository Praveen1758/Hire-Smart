const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogSchema = new Schema({

   user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

   },
   job_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobPosting',

   }
},{ timestamps: true })

module.exports = mongoose.model("log",LogSchema)
