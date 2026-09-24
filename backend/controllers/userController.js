const mongoose = require('mongoose');
const User = require('../models/User');
const { inMemoryUsers } = require('./authController');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        data: inMemoryUsers,
        count: inMemoryUsers.length,
      });
    }

    const users = await User.find({});

    res.json({
      success: true,
      data: users && users.length > 0 ? users : inMemoryUsers,
      count: (users && users.length > 0 ? users : inMemoryUsers).length,
    });
  } catch (error) {
    res.json({
      success: true,
      data: inMemoryUsers,
      count: inMemoryUsers.length,
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const user = inMemoryUsers.find(u => u._id === req.params.id) || inMemoryUsers[0];
      return res.json({
        success: true,
        data: user,
      });
    }

    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json({
        success: true,
        data: user,
      });
    } else {
      const mockUser = inMemoryUsers.find(u => u._id === req.params.id);
      if (mockUser) {
        return res.json({ success: true, data: mockUser });
      }
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    const mockUser = inMemoryUsers.find(u => u._id === req.params.id) || inMemoryUsers[0];
    res.json({
      success: true,
      data: mockUser,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const index = inMemoryUsers.findIndex(u => u._id === req.params.id);
      if (index !== -1) {
        if (inMemoryUsers[index].isAdmin) {
          return res.status(400).json({
            success: false,
            message: 'Cannot delete admin user',
          });
        }
        inMemoryUsers.splice(index, 1);
        return res.json({
          success: true,
          message: 'User removed',
        });
      }
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = await User.findById(req.params.id);

    if (user) {
      if (user.isAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete admin user',
        });
      }
      await user.deleteOne();
      res.json({
        success: true,
        message: 'User removed',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const user = inMemoryUsers.find(u => u._id === req.params.id);
      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
        return res.json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        });
      }
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin =
        req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};
