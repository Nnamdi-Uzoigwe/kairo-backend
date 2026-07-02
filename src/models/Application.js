// src/models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  jobUrl: {
    type: String,
    default: '',
    trim: true,
  },
  status: {
    type: String,
    enum: ['applied', 'assessment', 'interviewing', 'offer', 'rejected'],
    default: 'applied',
  },
  salaryRange: {
    type: String,
    default: '',
    trim: true,
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
    trim: true,
  },
  // ✅ NEW: Add source field
  source: {
    type: String,
    enum: ['linkedin', 'twitter', 'referral', 'company_site', 'job_board', 'other'],
    default: 'other',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Application', ApplicationSchema);