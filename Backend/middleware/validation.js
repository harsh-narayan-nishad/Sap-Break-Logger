/**
 * Request Validation Middleware
 * Uses express-validator to validate incoming request data for the tracking system
 */

const { validationResult } = require('express-validator');

/**
 * Middleware to check for validation errors
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
  require('express-validator').body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
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
 * Validation rules for profile updates
 */
const profileUpdateValidation = [
  require('express-validator').body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  require('express-validator').body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  require('express-validator').body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
];

/**
 * Validation rules for password change
 */
const passwordChangeValidation = [
  require('express-validator').body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  require('express-validator').body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('New password must contain at least one number')
];

/**
 * Validation rules for starting a break
 */
const startBreakValidation = [
  require('express-validator').body('startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:mm format')
];

/**
 * Validation rules for ending a break
 */
const endBreakValidation = [
  require('express-validator').body('endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:mm format')
];

/**
 * Validation rules for work time updates
 */
const workTimeValidation = [
  require('express-validator').body('minutes')
    .isFloat({ min: 0 })
    .withMessage('Minutes must be a positive number')
];

/**
 * Validation rules for date queries
 */
const dateQueryValidation = [
  require('express-validator').query('date')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format')
];

/**
 * Validation rules for month queries
 */
const monthQueryValidation = [
  require('express-validator').query('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  
  require('express-validator').query('year')
    .optional()
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Year must be between 2020 and 2030')
];

/**
 * Validation rules for period queries
 */
const periodQueryValidation = [
  require('express-validator').query('period')
    .optional()
    .isIn(['week', 'month', 'year'])
    .withMessage('Period must be week, month, or year')
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
  profileUpdateValidation,
  passwordChangeValidation,
  startBreakValidation,
  endBreakValidation,
  workTimeValidation,
  dateQueryValidation,
  monthQueryValidation,
  periodQueryValidation,
  userIdValidation
};
