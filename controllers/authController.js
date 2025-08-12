/**
 * Authentication Controller
 * Handles user registration, login, and JWT token generation
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Generate JWT token for user
 * @param {Object} user - User object
 * @returns {string} - JWT token
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
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({
      error: true,
      message: existingUser.email === email 
        ? 'Email already registered' 
        : 'Username already taken'
    });
  }

  // Create new user
  const user = new User({
    username,
    email,
    password
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
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const updates = {};

  // Only update provided fields
  if (username) updates.username = username;
  if (email) updates.email = email;

  // Check for duplicate username/email if updating
  if (username || email) {
    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(username ? [{ username }] : [])
      ],
      _id: { $ne: req.user._id }
    });

    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: existingUser.email === email 
          ? 'Email already in use' 
          : 'Username already taken'
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
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};
