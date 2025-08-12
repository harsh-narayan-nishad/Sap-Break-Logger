/**
 * Request Validation Middleware
 * Uses express-validator to validate incoming request data
 */

const { validationResult } = require('express-validator');

/**
 * Middleware to check for validation errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

/**
 * Validation rules for user registration
 */
const registerValidation = [
  require('express-validator').body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  require('express-validator').body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  require('express-validator').body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  require('express-validator').body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  require('express-validator').body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Validation rules for starting a break
 */
const startBreakValidation = [
  require('express-validator').body('date')
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),
  
  require('express-validator').body('startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:mm format')
];

/**
 * Validation rules for ending a break
 */
const endBreakValidation = [
  require('express-validator').body('date')
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),
  
  require('express-validator').body('endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:mm format')
];

/**
 * Validation rules for date queries
 */
const dateQueryValidation = [
  require('express-validator').query('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)')
];

/**
 * Validation rules for user ID parameters
 */
const userIdValidation = [
  require('express-validator').param('userId')
    .isMongoId()
    .withMessage('Invalid user ID format')
];

module.exports = {
  validateRequest,
  registerValidation,
  loginValidation,
  startBreakValidation,
  endBreakValidation,
  dateQueryValidation,
  userIdValidation
};
