/**
 * Break Controller
 * Handles break management operations including start, end, and data retrieval
 */

const Break = require('../models/Break');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Start a new break for the authenticated user
 * POST /api/breaks/start
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const startBreak = asyncHandler(async (req, res) => {
  const { date, startTime } = req.body;
  const userId = req.user._id;

  // Convert date string to Date object
  const breakDate = new Date(date);
  breakDate.setHours(0, 0, 0, 0);

  // Check if there's already a break record for today
  let breakRecord = await Break.findOne({
    userId,
    date: breakDate
  });

  if (breakRecord) {
    // Check if user is already on a break
    if (breakRecord.status === 'On Break') {
      return res.status(400).json({
        error: true,
        message: 'You are already on a break'
      });
    }

    // Add new break to existing record
    breakRecord.breaks.push({
      startTime,
      endTime: null,
      duration: 0
    });
    breakRecord.status = 'On Break';
  } else {
    // Create new break record
    breakRecord = new Break({
      userId,
      date: breakDate,
      startTime,
      breaks: [{
        startTime,
        endTime: null,
        duration: 0
      }],
      status: 'On Break'
    });
  }

  await breakRecord.save();

  res.status(201).json({
    error: false,
    message: 'Break started successfully',
    data: {
      break: breakRecord
    }
  });
});

/**
 * End the current break for the authenticated user
 * POST /api/breaks/end
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const endBreak = asyncHandler(async (req, res) => {
  const { date, endTime } = req.body;
  const userId = req.user._id;

  // Convert date string to Date object
  const breakDate = new Date(date);
  breakDate.setHours(0, 0, 0, 0);

  // Find the break record for today
  const breakRecord = await Break.findOne({
    userId,
    date: breakDate
  });

  if (!breakRecord) {
    return res.status(404).json({
      error: true,
      message: 'No break record found for today'
    });
  }

  // Find the active break
  const activeBreak = breakRecord.breaks.find(b => !b.endTime);
  if (!activeBreak) {
    return res.status(400).json({
      error: true,
      message: 'No active break found'
    });
  }

  // End the break
  activeBreak.endTime = endTime;
  
  // Calculate break duration
  const startMinutes = breakRecord.timeToMinutes(activeBreak.startTime);
  const endMinutes = breakRecord.timeToMinutes(endTime);
  activeBreak.duration = Math.max(0, endMinutes - startMinutes);

  // Update total break duration
  breakRecord.totalBreakDuration = breakRecord.breaks.reduce((total, b) => total + (b.duration || 0), 0);

  // Update status
  if (breakRecord.breaks.every(b => b.endTime)) {
    breakRecord.status = 'Completed';
  } else {
    breakRecord.status = 'Active';
  }

  await breakRecord.save();

  res.status(200).json({
    error: false,
    message: 'Break ended successfully',
    data: {
      break: breakRecord
    }
  });
});

/**
 * Get today's break and work time data for the authenticated user
 * GET /api/breaks/today
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTodayData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { date } = req.query;

  // Use provided date or today
  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  // Get today's data
  const breakRecord = await Break.getTodayData(userId, targetDate);

  if (!breakRecord) {
    return res.status(200).json({
      error: false,
      message: 'No break data found for today',
      data: {
        status: 'No Data',
        workTime: 0,
        totalBreakDuration: 0,
        breaks: [],
        date: targetDate.toISOString().split('T')[0]
      }
    });
  }

  res.status(200).json({
    error: false,
    message: 'Today\'s data retrieved successfully',
    data: {
      status: breakRecord.status,
      workTime: breakRecord.workTime,
      totalBreakDuration: breakRecord.totalBreakDuration,
      breaks: breakRecord.breaks,
      date: breakRecord.formattedDate
    }
  });
});

/**
 * Get monthly break data for a specific user
 * GET /api/breaks/user/:userId/monthly
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserMonthlyData = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { month, year } = req.query;

  // Use provided month/year or current month
  const targetDate = month && year 
    ? new Date(parseInt(year), parseInt(month) - 1, 1)
    : new Date();

  // Verify user exists
  const user = await User.findById(userId).select('username email');
  if (!user) {
    return res.status(404).json({
      error: true,
      message: 'User not found'
    });
  }

  // Get monthly data
  const monthlyData = await Break.getMonthlyData(userId, targetDate);

  // Format data for calendar view
  const formattedData = {};
  monthlyData.forEach(record => {
    const dateKey = record.formattedDate;
    formattedData[dateKey] = {
      status: record.status,
      workTime: record.workTime,
      totalBreakDuration: record.totalBreakDuration,
      breaks: record.breaks,
      startTime: record.startTime,
      endTime: record.endTime
    };
  });

  res.status(200).json({
    error: false,
    message: 'Monthly data retrieved successfully',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      month: targetDate.getMonth() + 1,
      year: targetDate.getFullYear(),
      data: formattedData
    }
  });
});

/**
 * Get monthly break data for all users (admin endpoint)
 * GET /api/breaks/monthly
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllUsersMonthlyData = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  // Use provided month/year or current month
  const targetDate = month && year 
    ? new Date(parseInt(year), parseInt(month) - 1, 1)
    : new Date();

  // Get all users
  const users = await User.find().select('username email');
  
  // Get monthly data for all users
  const allUsersData = {};
  
  for (const user of users) {
    const monthlyData = await Break.getMonthlyData(user._id, targetDate);
    
    const formattedData = {};
    monthlyData.forEach(record => {
      const dateKey = record.formattedDate;
      formattedData[dateKey] = {
        status: record.status,
        workTime: record.workTime,
        totalBreakDuration: record.totalBreakDuration,
        breaks: record.breaks,
        startTime: record.startTime,
        endTime: record.endTime
      };
    });

    allUsersData[user.username] = formattedData;
  }

  res.status(200).json({
    error: false,
    message: 'All users monthly data retrieved successfully',
    data: {
      month: targetDate.getMonth() + 1,
      year: targetDate.getFullYear(),
      users: allUsersData
    }
  });
});

/**
 * Get break statistics for the authenticated user
 * GET /api/breaks/stats
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { period = 'week' } = req.query;

  let startDate, endDate;
  const now = new Date();

  // Calculate date range based on period
  switch (period) {
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
  }

  endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  // Get data for the period
  const breakData = await Break.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });

  // Calculate statistics
  const stats = {
    totalWorkTime: 0,
    totalBreakTime: 0,
    totalDays: breakData.length,
    averageWorkTime: 0,
    averageBreakTime: 0,
    mostProductiveDay: null,
    leastProductiveDay: null
  };

  if (breakData.length > 0) {
    stats.totalWorkTime = breakData.reduce((sum, record) => sum + (record.workTime || 0), 0);
    stats.totalBreakTime = breakData.reduce((sum, record) => sum + (record.totalBreakDuration || 0), 0);
    stats.averageWorkTime = Math.round(stats.totalWorkTime / breakData.length);
    stats.averageBreakTime = Math.round(stats.totalBreakTime / breakData.length);

    // Find most and least productive days
    const sortedByWorkTime = [...breakData].sort((a, b) => (b.workTime || 0) - (a.workTime || 0));
    stats.mostProductiveDay = sortedByWorkTime[0];
    stats.leastProductiveDay = sortedByWorkTime[sortedByWorkTime.length - 1];
  }

  res.status(200).json({
    error: false,
    message: 'User statistics retrieved successfully',
    data: {
      period,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      stats
    }
  });
});

module.exports = {
  startBreak,
  endBreak,
  getTodayData,
  getUserMonthlyData,
  getAllUsersMonthlyData,
  getUserStats
};
