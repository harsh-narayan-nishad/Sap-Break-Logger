/**
 * Break Management Routes
 * Handles break operations including start, end, and data retrieval
 */

const express = require('express');
const router = express.Router();

// Import controller and middleware
const breakController = require('../controllers/breakController');
const { authenticateToken } = require('../middleware/auth');
const { 
  validateRequest, 
  startBreakValidation, 
  endBreakValidation,
  dateQueryValidation,
  userIdValidation
} = require('../middleware/validation');

// All break routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/breaks/start
 * @desc    Start a new break for the authenticated user
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @body    { date: 'YYYY-MM-DD', startTime: 'HH:mm' }
 */
router.post('/start', startBreakValidation, validateRequest, breakController.startBreak);

/**
 * @route   POST /api/breaks/end
 * @desc    End the current break for the authenticated user
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @body    { date: 'YYYY-MM-DD', endTime: 'HH:mm' }
 */
router.post('/end', endBreakValidation, validateRequest, breakController.endBreak);

/**
 * @route   GET /api/breaks/today
 * @desc    Get today's break and work time data for the authenticated user
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @query   date? (optional) - Specific date in YYYY-MM-DD format
 */
router.get('/today', dateQueryValidation, validateRequest, breakController.getTodayData);

/**
 * @route   GET /api/breaks/stats
 * @desc    Get break statistics for the authenticated user
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @query   period? (optional) - 'week', 'month', or 'year' (default: 'week')
 */
router.get('/stats', breakController.getUserStats);

/**
 * @route   GET /api/breaks/user/:userId/monthly
 * @desc    Get monthly break data for a specific user
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @param   userId - User ID to get data for
 * @query   month? (optional) - Month number (1-12)
 * @query   year? (optional) - Year number
 */
router.get('/user/:userId/monthly', userIdValidation, validateRequest, breakController.getUserMonthlyData);

/**
 * @route   GET /api/breaks/monthly
 * @desc    Get monthly break data for all users (admin endpoint)
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @query   month? (optional) - Month number (1-12)
 * @query   year? (optional) - Year number
 */
router.get('/monthly', breakController.getAllUsersMonthlyData);

module.exports = router;
