// src/models/Reminder.js
const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  datetime: {
    type: Date,
    required: true,
  },
  tag: {
    type: String,
    enum: ['interview', 'follow-up', 'portfolio-review', 'recruiter-call', 'other'],
    default: 'other',
  },
  notes: {
    type: String,
    default: '',
    trim: true,
  },
  sent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Reminder', ReminderSchema);