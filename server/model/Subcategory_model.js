
// const mongoose = require('mongoose');
// const SubcategorySchema = new mongoose.Schema({
//    subcategory_name : {
//         type: String,
//         required: true
//     },
//     subcategory_description: {
//         type: String,
//         required: true
//     }
// });
// module.exports = mongoose.model("subcategory", SubcategorySchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubcategorySchema = new Schema({
  subcategory_name: {
    type: String,
    required: true
  },
  subcategory_description: {
    type: String,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category', // Assuming the Category model is named 'Category'
    required: true
  }
});

module.exports = mongoose.model('Subcategory', SubcategorySchema);
