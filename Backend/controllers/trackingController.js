/**
 * Tracking Controller
 * Handles break management, work time tracking, and data retrieval for the tracking system
 */

const User = require('../models/User');
const DayRecord = require('../models/DayRecord');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Start a break for the authenticated user
 * POST /api/tracking/start-break
 */
const startBreak = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { startTime } = req.body;

  // Validate start time format
  if (!startTime || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(startTime)) {
    return res.status(400).json({
      error: true,
      message: 'Valid start time is required (HH:mm format)'
    });
  }

  // Check if user is already on break
  const user = await User.findById(userId);
  if (user.status === 'break') {
    return res.status(400).json({
      error: true,
      message: 'You are already on a break'
    });
  }

  // Get or create today's record
  let todayRecord = await DayRecord.getTodayRecord(userId);
  if (!todayRecord) {
    const today = new Date().toISOString().split('T')[0];
    todayRecord = new DayRecord({
      userId,
      date: today,
      workTime: user.dailyWorkTime,
      status: 'break'
    });
  }

  // Add break to today's record
  await todayRecord.addBreak(startTime);

  // Update user status
  await user.startBreak();

  // Refresh user data
  const updatedUser = await User.findById(userId).select('-password');

  res.status(200).json({
    error: false,
    message: 'Break started successfully',
    data: {
      user: updatedUser.profile,
      dayRecord: todayRecord
    }
  });
});

/**
 * End the current break for the authenticated user
 * POST /api/tracking/end-break
 */
const endBreak = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { endTime } = req.body;

  // Validate end time format
  if (!endTime || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(endTime)) {
    return res.status(400).json({
      error: true,
      message: 'Valid end time is required (HH:mm format)'
    });
  }

  // Check if user is on break
  const user = await User.findById(userId);
  if (user.status !== 'break') {
    return res.status(400).json({
      error: true,
      message: 'You are not currently on a break'
    });
  }

  // Get today's record
  const todayRecord = await DayRecord.getTodayRecord(userId);
  if (!todayRecord) {
    return res.status(404).json({
      error: true,
      message: 'No daily record found for today'
    });
  }

  // End the break
  await todayRecord.endCurrentBreak(endTime);

  // Update user status
  await user.endBreak();

  // Refresh user data
  const updatedUser = await User.findById(userId).select('-password');

  res.status(200).json({
    error: false,
    message: 'Break ended successfully',
    data: {
      user: updatedUser.profile,
      dayRecord: todayRecord
    }
  });
});

/**
 * Get today's tracking data for the authenticated user
 * GET /api/tracking/today
 */
const getTodayData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { date } = req.query;

  // Use provided date or today
  const targetDate = date || new Date().toISOString().split('T')[0];

  // Get today's record
  let todayRecord = await DayRecord.findOne({ userId, date: targetDate });
  
  if (!todayRecord) {
    // Create empty record if none exists
    todayRecord = new DayRecord({
      userId,
      date: targetDate,
      workTime: 0,
      breaks: [],
      totalBreakTime: 0,
      status: 'inactive'
    });
  }

  // Get user data
  const user = await User.findById(userId).select('-password');

  res.status(200).json({
    error: false,
    message: 'Today\'s data retrieved successfully',
    data: {
      user: user.profile,
      dayRecord: todayRecord
    }
  });
});

/**
 * Get monthly tracking data for a specific user
 * GET /api/tracking/user/:userId/monthly
 */
const getUserMonthlyData = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { month, year } = req.query;

  // Use provided month/year or current month
  const targetMonth = month && year ? `${year}-${month.padStart(2, '0')}` : new Date().toISOString().substring(0, 7);

  // Verify user exists
  const user = await User.findById(userId).select('name email avatar status');
  if (!user) {
    return res.status(404).json({
      error: true,
      message: 'User not found'
    });
  }

  // Get monthly records
  const monthlyRecords = await DayRecord.getMonthlyRecords(userId, targetMonth);

  // Format data for calendar view (similar to frontend structure)
  const formattedData = {};
  monthlyRecords.forEach(record => {
    formattedData[record.date] = {
      workTime: record.workTime,
      breaks: record.breaks,
      totalBreakTime: record.totalBreakTime,
      status: record.status
    };
  });

  res.status(200).json({
    error: false,
    message: 'Monthly data retrieved successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        status: user.status
      },
      month: targetMonth,
      data: formattedData
    }
  });
});

/**
 * Get monthly tracking data for all users
 * GET /api/tracking/monthly
 */
const getAllUsersMonthlyData = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  // Use provided month/year or current month
  const targetMonth = month && year ? `${year}-${month.padStart(2, '0')}` : new Date().toISOString().substring(0, 7);

  // Get all users
  const users = await User.find().select('name email avatar status');
  
  // Get monthly data for all users
  const allUsersData = {};
  
  for (const user of users) {
    const monthlyRecords = await DayRecord.getMonthlyRecords(user._id, targetMonth);
    
    const formattedData = {};
    monthlyRecords.forEach(record => {
      formattedData[record.date] = {
        workTime: record.workTime,
        breaks: record.breaks,
        totalBreakTime: record.totalBreakTime,
        status: record.status
      };
    });

    allUsersData[user.name] = formattedData;
  }

  res.status(200).json({
    error: false,
    message: 'All users monthly data retrieved successfully',
    data: {
      month: targetMonth,
      users: allUsersData
    }
  });
});

/**
 * Get user statistics
 * GET /api/tracking/stats
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
  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  const records = await DayRecord.find({
    userId,
    date: { $gte: startDateStr, $lte: endDateStr }
  }).sort({ date: 1 });

  // Calculate statistics
  const stats = {
    totalWorkTime: 0,
    totalBreakTime: 0,
    totalDays: records.length,
    averageWorkTime: 0,
    averageBreakTime: 0,
    mostProductiveDay: null,
    leastProductiveDay: null
  };

  if (records.length > 0) {
    stats.totalWorkTime = records.reduce((sum, record) => sum + (record.workTime || 0), 0);
    stats.totalBreakTime = records.reduce((sum, record) => sum + (record.totalBreakTime || 0), 0);
    stats.averageWorkTime = Math.round(stats.totalWorkTime / records.length);
    stats.averageBreakTime = Math.round(stats.totalBreakTime / records.length);

    // Find most and least productive days
    const sortedByWorkTime = [...records].sort((a, b) => (b.workTime || 0) - (a.workTime || 0));
    stats.mostProductiveDay = sortedByWorkTime[0];
    stats.leastProductiveDay = sortedByWorkTime[sortedByWorkTime.length - 1];
  }

  res.status(200).json({
    error: false,
    message: 'User statistics retrieved successfully',
    data: {
      period,
      startDate: startDateStr,
      endDate: endDateStr,
      stats
    }
  });
});

/**
 * Update work time for the authenticated user
 * PUT /api/tracking/work-time
 */
const updateWorkTime = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { minutes } = req.body;

  if (typeof minutes !== 'number' || minutes < 0) {
    return res.status(400).json({
      error: true,
      message: 'Valid minutes value is required'
    });
  }

  // Update user's daily work time
  const user = await User.findById(userId);
  await user.updateWorkTime(minutes);

  // Update today's record
  const today = new Date().toISOString().split('T')[0];
  let todayRecord = await DayRecord.getTodayRecord(userId);
  
  if (!todayRecord) {
    todayRecord = new DayRecord({
      userId,
      date: today,
      workTime: minutes,
      status: 'active'
    });
  } else {
    todayRecord.workTime = user.dailyWorkTime;
    todayRecord.status = 'active';
  }

  await todayRecord.save();

  res.status(200).json({
    error: false,
    message: 'Work time updated successfully',
    data: {
      user: user.profile,
      dayRecord: todayRecord
    }
  });
});

/**
 * Get all users with their current status
 * GET /api/tracking/users
 */
const getTrackingUsers = asyncHandler(async (req, res) => {
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
  startBreak,
  endBreak,
  getTodayData,
  getUserMonthlyData,
  getAllUsersMonthlyData,
  getUserStats,
  updateWorkTime,
  getTrackingUsers
};

