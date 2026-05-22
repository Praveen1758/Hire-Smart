const express = require('express');
const router = express.Router();
const { AddSubcategory, GetSubcategories, UpdateSubcategory, DeleteSubcategory, GetSubcategoriesByCategory } = require('../controller/Subcatcontroller');

router.post('/AddSubcategory', AddSubcategory);
router.get('/GetSubcategories/', GetSubcategories);
router.put('/UpdateSubcategory/:id', UpdateSubcategory);
router.delete('/DeleteSubcategory/:id', DeleteSubcategory);
router.get('/GetSubcategoriesByCategory/:categoryId', GetSubcategoriesByCategory); // Corrected route

module.exports = router;
