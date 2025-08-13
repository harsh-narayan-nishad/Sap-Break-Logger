/**
 * Authentication Controller
 * Handles user registration, login, and profile management for the tracking system
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Generate JWT token for user
 */
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      error: true,
      message: 'Email already registered'
    });
  }

  // Create new user
  const user = new User({
    name,
    email,
    password,
    status: 'inactive', // New users start as inactive
    dailyWorkTime: 0
  });

  await user.save();

  // Generate token
  const token = generateToken(user);

  res.status(201).json({
    error: false,
    message: 'User registered successfully',
    data: {
      user: user.profile,
      token
    }
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      error: true,
      message: 'Invalid email or password'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      error: true,
      message: 'Invalid email or password'
    });
  }

  // Update user status to active on login
  user.status = 'active';
  user.lastActiveDate = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user);

  res.status(200).json({
    error: false,
    message: 'Login successful',
    data: {
      user: user.profile,
      token
    }
  });
});

/**
 * Get current user profile
 * GET /api/auth/profile
 */
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    error: false,
    message: 'Profile retrieved successfully',
    data: {
      user: req.user.profile
    }
  });
});

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, avatar } = req.body;
  const updates = {};

  // Only update provided fields
  if (name) updates.name = name;
  if (email) updates.email = email;
  if (avatar !== undefined) updates.avatar = avatar;

  // Check for duplicate email if updating
  if (email) {
    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.user._id }
    });

    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: 'Email already in use'
      });
    }
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    error: false,
    message: 'Profile updated successfully',
    data: {
      user: updatedUser.profile
    }
  });
});

/**
 * Change user password
 * PUT /api/auth/change-password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Verify current password
  const user = await User.findById(req.user._id);
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  
  if (!isCurrentPasswordValid) {
    return res.status(401).json({
      error: true,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    error: false,
    message: 'Password changed successfully'
  });
});

/**
 * Logout user (optional - client-side token removal)
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  // Update user status to inactive on logout
  await User.findByIdAndUpdate(req.user._id, {
    status: 'inactive',
    lastActiveDate: new Date()
  });

  res.status(200).json({
    error: false,
    message: 'Logout successful'
  });
});

/**
 * Get all users (for admin/management purposes)
 * GET /api/auth/users
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ name: 1 });

  res.status(200).json({
    error: false,
    message: 'Users retrieved successfully',
    data: {
      users: users.map(user => user.profile)
    }
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  getAllUsers
};
