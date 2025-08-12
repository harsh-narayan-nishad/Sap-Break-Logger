/**
 * Break Model Schema
 * Defines the structure for break and work time tracking data
 */

const mongoose = require('mongoose');

const breakSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    index: true // Index for efficient date-based queries
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:mm format']
  },
  endTime: {
    type: String,
    required: false,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:mm format']
  },
  workTime: {
    type: Number,
    default: 0,
    min: [0, 'Work time cannot be negative'],
    description: 'Work time in minutes'
  },
  totalBreakDuration: {
    type: Number,
    default: 0,
    min: [0, 'Break duration cannot be negative'],
    description: 'Total break duration in minutes'
  },
  status: {
    type: String,
    enum: ['Active', 'On Break', 'Completed'],
    default: 'Active',
    description: 'Current status of the work session'
  },
  breaks: [{
    startTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Break start time must be in HH:mm format']
    },
    endTime: {
      type: String,
      required: false,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Break end time must be in HH:mm format']
    },
    duration: {
      type: Number,
      default: 0,
      min: [0, 'Break duration cannot be negative'],
      description: 'Break duration in minutes'
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * Compound index for efficient queries by user and date
 */
breakSchema.index({ userId: 1, date: 1 }, { unique: true });

/**
 * Virtual for calculating total work time including breaks
 */
breakSchema.virtual('totalWorkTime').get(function() {
  return this.workTime + this.totalBreakDuration;
});

/**
 * Virtual for checking if break is currently active
 */
breakSchema.virtual('isOnBreak').get(function() {
  return this.status === 'On Break';
});

/**
 * Virtual for formatted date string
 */
breakSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

/**
 * Pre-save middleware to calculate work time and break duration
 */
breakSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    // Calculate total work time (assuming 8-hour work day = 480 minutes)
    const startMinutes = this.timeToMinutes(this.startTime);
    const endMinutes = this.timeToMinutes(this.endTime);
    
    if (endMinutes > startMinutes) {
      this.workTime = endMinutes - startMinutes;
    } else {
      this.workTime = 0;
    }
    
    // Calculate total break duration from individual breaks
    this.totalBreakDuration = this.breaks.reduce((total, breakItem) => {
      return total + (breakItem.duration || 0);
    }, 0);
    
    // Update status
    if (this.breaks.some(b => !b.endTime)) {
      this.status = 'On Break';
    } else if (this.endTime) {
      this.status = 'Completed';
    }
  }
  
  next();
});

/**
 * Instance method to convert time string to minutes
 * @param {string} timeStr - Time in HH:mm format
 * @returns {number} - Time in minutes
 */
breakSchema.methods.timeToMinutes = function(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Instance method to convert minutes to time string
 * @param {number} minutes - Time in minutes
 * @returns {string} - Time in HH:mm format
 */
breakSchema.methods.minutesToTime = function(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Static method to get today's data for a user
 * @param {ObjectId} userId - User ID
 * @param {Date} date - Optional specific date
 * @returns {Promise<Object>} - Today's break data
 */
breakSchema.statics.getTodayData = async function(userId, date = new Date()) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return await this.findOne({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay }
  });
};

/**
 * Static method to get monthly data for a user
 * @param {ObjectId} userId - User ID
 * @param {Date} date - Date to get month from
 * @returns {Promise<Array>} - Monthly break data
 */
breakSchema.statics.getMonthlyData = async function(userId, date = new Date()) {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  
  return await this.find({
    userId,
    date: { $gte: startOfMonth, $lte: endOfMonth }
  }).sort({ date: 1 });
};

module.exports = mongoose.model('Break', breakSchema);
