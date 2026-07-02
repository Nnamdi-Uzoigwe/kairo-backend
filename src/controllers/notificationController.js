// src/controllers/notificationController.js
const User = require('../models/User');

// Save Expo push token for a user
exports.savePushToken = async (req, res) => {
  try {
    const { expoPushToken } = req.body;

    if (!expoPushToken) {
      return res.status(400).json({ message: 'Push token is required' });
    }

    await User.findByIdAndUpdate(req.userId, { expoPushToken });

    res.json({ message: 'Push token saved successfully' });
  } catch (error) {
    console.error('Save push token error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};