const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getTopProducts,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

// Get top products must be before /:id route
router.get('/top', getTopProducts);

// Public routes
router.route('/').get(getProducts).post(protect, admin, [
  body('name', 'Name is required').trim().notEmpty(),
  body('price', 'Price must be a number').isNumeric(),
  body('brand', 'Brand is required').trim().notEmpty(),
  body('category', 'Category is required').trim().notEmpty(),
  body('stock', 'Stock must be a number').isNumeric(),
  body('description', 'Description is required').trim().notEmpty(),
], createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews').post(protect, createReview);

module.exports = router;
