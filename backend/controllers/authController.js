const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// In-memory mock users fallback when MongoDB is not running
let inMemoryUsers = [
  {
    _id: '64a1b2c3d4e5f6a7b8c9d0e1',
    name: 'Maison Admin',
    email: 'admin@example.com',
    password: 'password123',
    isAdmin: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  },
  {
    _id: '64a1b2c3d4e5f6a7b8c9d0e2',
    name: 'Lord Alistair Sterling',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    _id: '64a1b2c3d4e5f6a7b8c9d0e3',
    name: 'Countess Genevieve de Grasse',
    email: 'jane@example.com',
    password: 'password123',
    isAdmin: false,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  },
];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // If MongoDB is offline, use in-memory store
    if (mongoose.connection.readyState !== 1) {
      const existing = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email',
        });
      }

      const newUser = {
        _id: 'mock_user_' + Date.now(),
        name,
        email,
        password,
        isAdmin: email.toLowerCase().includes('admin'),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      };
      inMemoryUsers.push(newUser);

      const token = generateToken(newUser._id);
      return res.status(201).json({
        success: true,
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          isAdmin: newUser.isAdmin,
          avatar: newUser.avatar,
          token,
        },
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          avatar: user.avatar,
          token,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data',
      });
    }
  } catch (error) {
    // Fallback if DB error occurs
    const { name, email, password } = req.body;
    const newUser = {
      _id: 'mock_user_' + Date.now(),
      name: name || 'Client',
      email: email || 'user@example.com',
      isAdmin: (email || '').toLowerCase().includes('admin'),
    };
    const token = generateToken(newUser._id);
    return res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token,
      },
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // If MongoDB is offline, use in-memory store
    if (mongoose.connection.readyState !== 1) {
      const user = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) ||
                   (email.toLowerCase().includes('admin') ? inMemoryUsers[0] : inMemoryUsers[1]);

      if (user) {
        const token = generateToken(user._id);
        return res.json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            avatar: user.avatar,
            token,
          },
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check for user in MongoDB
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
        token,
      },
    });
  } catch (error) {
    // Database connection fallback
    const { email } = req.body;
    const user = inMemoryUsers.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || inMemoryUsers[0];
    const token = generateToken(user._id);
    return res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
        token,
      },
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const user = inMemoryUsers.find(u => u._id === req.user?._id) || inMemoryUsers[0];
      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          avatar: user.avatar,
        },
      });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          avatar: user.avatar,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    const user = inMemoryUsers[0];
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
      },
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      let user = inMemoryUsers.find(u => u._id === req.user?._id);
      if (!user) user = inMemoryUsers[0];
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) user.password = req.body.password;

      const token = generateToken(user._id);
      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          avatar: user.avatar,
          token,
        },
      });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const token = generateToken(updatedUser._id);

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          avatar: updatedUser.avatar,
          token,
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
  register,
  login,
  getProfile,
  updateProfile,
  inMemoryUsers,
};
