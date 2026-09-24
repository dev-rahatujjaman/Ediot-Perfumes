const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(protect, admin, getUsers);
router
  .route('/:id')
  .get(protect, admin, getUserById)
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);

module.exports = router;
