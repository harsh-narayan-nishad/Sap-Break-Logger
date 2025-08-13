/**
 * DayRecord Model Schema
 * Matches the frontend DayRecord interface for daily tracking data
 */

const mongoose = require('mongoose');

const breakRecordSchema = new mongoose.Schema({
  start: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:mm format']
  },
  end: {
    type: String,
    required: false,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:mm format']
  },
  duration: {
    type: Number,
    default: 0,
    min: [0, 'Break duration cannot be negative'],
    description: 'Break duration in minutes'
  }
}, {
  _id: false // Don't create _id for subdocuments
});

const dayRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format']
  },
  workTime: {
    type: Number,
    default: 0,
    min: [0, 'Work time cannot be negative'],
    description: 'Work time in minutes'
  },
  breaks: {
    type: [breakRecordSchema],
    default: []
  },
  totalBreakTime: {
    type: Number,
    default: 0,
    min: [0, 'Total break time cannot be negative'],
    description: 'Total break time in minutes'
  },
  status: {
    type: String,
    enum: ['active', 'break', 'inactive', 'completed'],
    default: 'inactive'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * Compound index for efficient queries by user and date
 */
dayRecordSchema.index({ userId: 1, date: 1 }, { unique: true });

/**
 * Virtual for formatted work time
 */
dayRecordSchema.virtual('formattedWorkTime').get(function() {
  const hours = Math.floor(this.workTime / 60);
  const minutes = this.workTime % 60;
  return `${hours}h ${minutes}m`;
});

/**
 * Virtual for formatted total break time
 */
dayRecordSchema.virtual('formattedTotalBreakTime').get(function() {
  const hours = Math.floor(this.totalBreakTime / 60);
  const minutes = this.totalBreakTime % 60;
  return `${hours}h ${minutes}m`;
});

/**
 * Virtual for total active time (work + breaks)
 */
dayRecordSchema.virtual('totalActiveTime').get(function() {
  return this.workTime + this.totalBreakTime;
});

/**
 * Pre-save middleware to calculate total break time
 */
dayRecordSchema.pre('save', function(next) {
  // Calculate total break time from individual breaks
  this.totalBreakTime = this.breaks.reduce((total, breakItem) => {
    return total + (breakItem.duration || 0);
  }, 0);
  
  // Update last activity
  this.lastActivity = new Date();
  
  next();
});

/**
 * Static method to get today's record for a user
 */
dayRecordSchema.statics.getTodayRecord = async function(userId) {
  const today = new Date().toISOString().split('T')[0];
  return await this.findOne({ userId, date: today });
};

/**
 * Static method to get monthly records for a user
 */
dayRecordSchema.statics.getMonthlyRecords = async function(userId, month) {
  const startDate = `${month}-01`;
  const endDate = `${month}-31`;
  
  return await this.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });
};

/**
 * Static method to get monthly records for all users
 */
dayRecordSchema.statics.getAllUsersMonthlyRecords = async function(month) {
  const startDate = `${month}-01`;
  const endDate = `${month}-31`;
  
  return await this.find({
    date: { $gte: startDate, $lte: endDate }
  }).populate('userId', 'name email avatar status').sort({ date: 1 });
};

/**
 * Instance method to add a break
 */
dayRecordSchema.methods.addBreak = function(startTime, endTime = null, duration = 0) {
  this.breaks.push({
    start: startTime,
    end: endTime,
    duration: duration
  });
  
  if (endTime) {
    this.status = 'active';
  } else {
    this.status = 'break';
  }
  
  return this.save();
};

/**
 * Instance method to end the current break
 */
dayRecordSchema.methods.endCurrentBreak = function(endTime) {
  const activeBreak = this.breaks.find(b => !b.end);
  if (activeBreak) {
    activeBreak.end = endTime;
    
    // Calculate duration if not provided
    if (!activeBreak.duration) {
      const startMinutes = this.timeToMinutes(activeBreak.start);
      const endMinutes = this.timeToMinutes(endTime);
      activeBreak.duration = Math.max(0, endMinutes - startMinutes);
    }
    
    this.status = 'active';
    return this.save();
  }
  throw new Error('No active break found');
};

/**
 * Instance method to convert time string to minutes
 */
dayRecordSchema.methods.timeToMinutes = function(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Instance method to convert minutes to time string
 */
dayRecordSchema.methods.minutesToTime = function(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

module.exports = mongoose.model('DayRecord', dayRecordSchema);

