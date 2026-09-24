const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register route
router.post(
  '/register',
  [
    body('name', 'Name is required').trim().notEmpty(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
  ],
  register
);

// Login route
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').exists(),
  ],
  login
);

// Get and update profile (protected routes)
router.route('/profile').get(protect, getProfile).put(protect, updateProfile);

module.exports = router;
