/**
 * Authentication Routes
 * Handles user registration, login, and profile management for the tracking system
 */

const express = require('express');
const router = express.Router();

// Import controller and middleware
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { 
  validateRequest, 
  registerValidation, 
  loginValidation,
  profileUpdateValidation,
  passwordChangeValidation
} = require('../middleware/validation');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    { name, email, password }
 */
router.post('/register', registerValidation, validateRequest, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', loginValidation, validateRequest, authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (updates status to inactive)
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.post('/logout', authenticateToken, authController.logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get('/profile', authenticateToken, authController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @body    { name?, email?, avatar? }
 */
router.put('/profile', authenticateToken, profileUpdateValidation, validateRequest, authController.updateProfile);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @body    { currentPassword, newPassword }
 */
router.put('/change-password', authenticateToken, passwordChangeValidation, validateRequest, authController.changePassword);

/**
 * @route   GET /api/auth/users
 * @desc    Get all users (for admin/management purposes)
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get('/users', authenticateToken, authController.getAllUsers);

module.exports = router;
