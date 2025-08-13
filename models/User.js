/**
 * User Model Schema
 * Matches the frontend User interface for the tracking system
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  avatar: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'break', 'inactive'],
    default: 'inactive'
  },
  currentBreakStart: {
    type: Date,
    default: null
  },
  dailyWorkTime: {
    type: Number,
    default: 0,
    min: [0, 'Daily work time cannot be negative'],
    description: 'Daily work time in minutes'
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * Pre-save middleware to hash password before saving
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method to compare password with hashed password
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

/**
 * Instance method to start a break
 */
userSchema.methods.startBreak = function() {
  this.status = 'break';
  this.currentBreakStart = new Date();
  return this.save();
};

/**
 * Instance method to end a break
 */
userSchema.methods.endBreak = function() {
  if (this.status !== 'break' || !this.currentBreakStart) {
    throw new Error('User is not currently on break');
  }
  
  this.status = 'active';
  this.currentBreakStart = null;
  return this.save();
};

/**
 * Instance method to update daily work time
 */
userSchema.methods.updateWorkTime = function(minutes) {
  this.dailyWorkTime = Math.max(0, this.dailyWorkTime + minutes);
  this.lastActiveDate = new Date();
  return this.save();
};

/**
 * Virtual for user's public profile (excluding sensitive data)
 */
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    status: this.status,
    currentBreakStart: this.currentBreakStart,
    dailyWorkTime: this.dailyWorkTime,
    lastActiveDate: this.lastActiveDate,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
