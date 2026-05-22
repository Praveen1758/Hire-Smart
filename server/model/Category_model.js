

const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true
    },
    category_description: {
        type: String,
        required: true
    },
    category_date: {
        type: Date,
        default: Date.now,
    },
    category_image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Category", CategorySchema);