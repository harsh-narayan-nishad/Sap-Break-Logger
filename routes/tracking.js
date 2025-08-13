/**
 * Tracking Routes
 * Handles break management, work time tracking, and data retrieval for the tracking system
 */

const express = require('express');
const router = express.Router();

// Import controller and middleware
const trackingController = require('../controllers/trackingController');
const { authenticateToken } = require('../middleware/auth');
const { 
  validateRequest, 
  startBreakValidation, 
  endBreakValidation,
  workTimeValidation,
  dateQueryValidation,
  monthQueryValidation,
  periodQueryValidation,
  userIdValidation
} = require('../middleware/validation');

// All tracking routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/tracking/start-break
 * @desc    Start a break for the authenticated user
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @body    { startTime: 'HH:mm' }
 */
router.post('/start-break', startBreakValidation, validateRequest, trackingController.startBreak);

/**
 * @route   POST /api/tracking/end-break
 * @desc    End the current break for the authenticated user
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @body    { endTime: 'HH:mm' }
 */
router.post('/end-break', endBreakValidation, validateRequest, trackingController.endBreak);

/**
 * @route   GET /api/tracking/today
 * @desc    Get today's tracking data for the authenticated user
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @query   date? (optional) - Specific date in YYYY-MM-DD format
 */
router.get('/today', dateQueryValidation, validateRequest, trackingController.getTodayData);

/**
 * @route   GET /api/tracking/stats
 * @desc    Get tracking statistics for the authenticated user
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @query   period? (optional) - 'week', 'month', or 'year' (default: 'week')
 */
router.get('/stats', periodQueryValidation, validateRequest, trackingController.getUserStats);

/**
 * @route   PUT /api/tracking/work-time
 * @desc    Update work time for the authenticated user
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @body    { minutes: number }
 */
router.put('/work-time', workTimeValidation, validateRequest, trackingController.updateWorkTime);

/**
 * @route   GET /api/tracking/users
 * @desc    Get all users with their current tracking status
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get('/users', trackingController.getTrackingUsers);

/**
 * @route   GET /api/tracking/user/:userId/monthly
 * @desc    Get monthly tracking data for a specific user
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @param   userId - User ID to get data for
 * @query   month? (optional) - Month number (1-12)
 * @query   year? (optional) - Year number
 */
router.get('/user/:userId/monthly', userIdValidation, monthQueryValidation, validateRequest, trackingController.getUserMonthlyData);

/**
 * @route   GET /api/tracking/monthly
 * @desc    Get monthly tracking data for all users
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @query   month? (optional) - Month number (1-12)
 * @query   year? (optional) - Year number
 */
router.get('/monthly', monthQueryValidation, validateRequest, trackingController.getAllUsersMonthlyData);

module.exports = router;

