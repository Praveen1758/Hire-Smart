// const SubcategorySchema = require('../model/Subcategory_model'); // Import the Subcategory model

// // Define AddSubcategory function
// const AddSubcategory = async (req, res) => {
//     try {
//         console.log("AddSubcategory endpoint hit"); // Log endpoint hit
//         const { subcategory_name, subcategory_description } = req.body;

//         // Create a new Subcategory instance
//         const subcatdata = new SubcategorySchema({ subcategory_name, subcategory_description });
//         const subcatdatasave = await subcatdata.save(); // Save the new subcategory
//         res.status(201).json(subcatdatasave); // Return the saved subcategory with status 201 (Created)
//     } catch (error) {
//         console.error("Error in AddSubcategory:", error.message);
//         res.status(500).send("Error adding subcategory");
//     }
// };


// // Define GetSubcategories function
// const GetSubcategories = async (req, res) => {
//     try {
//         const subcategories = await SubcategorySchema.find(); // Retrieve all subcategories
//         res.status(200).json(subcategories); // Return the subcategories with status 200 (OK)
//     } catch (err) {
//         console.error("Error in GetSubcategories:", err.message);
//         res.status(500).send("Error fetching subcategories");
//     }
// };

// // const GetSubcategoriesByCategory = async (req, res) => {
// //     try {
// //         const { categoryId } = req.params;
// //         const subcategories = await SubcategorySchema.find({ categoryId }); // Retrieve subcategories by category ID
// //         res.status(200).json(subcategories); // Return the subcategories with status 200 (OK)
// //     } catch (err) {
// //         console.error("Error in GetSubcategoriesByCategory:", err.message);
// //         res.status(500).send("Error fetching subcategories");
// //     }
// // };

// const GetSubcategoriesByCategory = async (req, res) => {
//     const { categoryId } = req.params;
//     try {
//       console.log(`Fetching subcategories for category ID: ${categoryId}`); // Debugging line
//       const subcategories = await Subcategory.find({ category: categoryId });
//       console.log('Subcategories fetched:', subcategories); // Debugging line
//       res.status(200).json(subcategories);
//     } catch (error) {
//       console.error('Error fetching subcategories:', error); // Debugging line
//       res.status(500).json({ message: 'Error fetching subcategories', error });
//     }
//   };

// // Define UpdateSubcategory function
// const UpdateSubcategory = async (req, res) => {
//     const { subcategory_name, subcategory_description } = req.body;

//     try {
//         const NewSubcategory = {};
//         if (subcategory_name) { NewSubcategory.subcategory_name = subcategory_name; }
//         if (subcategory_description) { NewSubcategory.subcategory_description = subcategory_description; }

//         let subcategory = await SubcategorySchema.findByIdAndUpdate(req.params.id, { $set: NewSubcategory }, { new: true });
//         if (!subcategory) {
//             return res.status(404).send("Subcategory not found");
//         }
//         res.status(200).json({ subcategory }); // Return the updated subcategory with status 200 (OK)
//     } catch (error) {
//         console.error("Error in UpdateSubcategory:", error.message);
//         res.status(500).send("Error updating subcategory");
//     }
// };

// // Define DeleteSubcategory function
// const DeleteSubcategory = async (req, res) => {
//     try {
//         let subcategory = await SubcategorySchema.findById(req.params.id);
//         if (!subcategory) {
//             return res.status(404).send("Subcategory not found");
//         }
//         await SubcategorySchema.findByIdAndDelete(req.params.id); // Delete the subcategory
//         res.status(200).json({ success: "Subcategory deleted", subcategory }); // Return the deleted subcategory with status 200 (OK)
//     } catch (error) {
//         console.error("Error in DeleteSubcategory:", error.message);
//         res.status(500).send("Error deleting subcategory");
//     }
// };

// module.exports = {
//     AddSubcategory,
//     GetSubcategories,
//     UpdateSubcategory,
//     DeleteSubcategory,
//     GetSubcategoriesByCategory
// };


const SubcategorySchema = require('../model/Subcategory_model'); 
const CategorySchema = require('../model/Category_model');// Import the Subcategory model

// Define AddSubcategory function
const AddSubcategory = async (req, res) => {
    try {
        console.log("AddSubcategory endpoint hit"); // Log endpoint hit
        const { subcategory_name, subcategory_description, category } = req.body;

        // Validate required fields
        if (!subcategory_name || !subcategory_description || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new Subcategory instance
        const subcatdata = new SubcategorySchema({ subcategory_name, subcategory_description, category });
        const subcatdatasave = await subcatdata.save(); // Save the new subcategory
        res.status(201).json(subcatdatasave); // Return the saved subcategory with status 201 (Created)
    } catch (error) {
        console.error("Error in AddSubcategory:", error.message);
        res.status(500).send("Error adding subcategory");
    }
};

// Define GetSubcategories function

const GetSubcategories = async (req, res) => {
  try {
    const subcategories = await SubcategorySchema.find().populate('category'); // Add populate
    res.status(200).json(subcategories);
  } catch (err) {
    console.error("Error in GetSubcategories:", err.message);
    res.status(500).send("Error fetching subcategories");
  }
};



// Define GetSubcategoriesByCategory function
const GetSubcategoriesByCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        console.log(`Fetching subcategories for category ID: ${categoryId}`); // Debugging line
        const subcategories = await SubcategorySchema.find({ category: categoryId });
        console.log('Subcategories fetched:', subcategories); // Debugging line
        res.status(200).json(subcategories);
    } catch (error) {
        console.error('Error fetching subcategories:', error); // Debugging line
        res.status(500).json({ message: 'Error fetching subcategories', error });
    }
};

// Define UpdateSubcategory function
const UpdateSubcategory = async (req, res) => {
  const { subcategory_name, subcategory_description, category } = req.body;

  try {
    const updateData = {};
    if (subcategory_name) updateData.subcategory_name = subcategory_name;
    if (subcategory_description) updateData.subcategory_description = subcategory_description;
    if (category) updateData.category = category;

    // Step 1: Update
    const updated = await SubcategorySchema.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );  

    if (!updated) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Step 2: Populate (guaranteed)
    const populatedSubcategory = await SubcategorySchema
      .findById(updated._id)
      .populate('category', 'category_name');

    res.status(200).json({ subcategory: populatedSubcategory });

  } catch (error) {
    console.error("Error in UpdateSubcategory:", error.message);
    res.status(500).json({ message: "Error updating subcategory" });
  }
};



// Define DeleteSubcategory function
const DeleteSubcategory = async (req, res) => {
    try {
        let subcategory = await SubcategorySchema.findById(req.params.id);
        if (!subcategory) {
            return res.status(404).send("Subcategory not found");
        }
        await SubcategorySchema.findByIdAndDelete(req.params.id); // Delete the subcategory
        res.status(200).json({ success: "Subcategory deleted", subcategory }); // Return the deleted subcategory with status 200 (OK)
    } catch (error) {
        console.error("Error in DeleteSubcategory:", error.message);
        res.status(500).send("Error deleting subcategory");
    }
};

module.exports = {
    AddSubcategory,
    GetSubcategories,
    UpdateSubcategory,
    DeleteSubcategory,
    GetSubcategoriesByCategory
};
