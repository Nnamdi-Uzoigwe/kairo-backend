// src/services/pushNotificationService.js
const axios = require('axios');
const User = require('../models/User');

/**
 * Send a push notification via Expo Push API
 * @param {string} expoPushToken - The user's Expo push token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Optional data payload
 */
const sendPushNotification = async (expoPushToken, title, body, data = {}) => {
  if (!expoPushToken) {
    console.warn('⚠️ No push token provided');
    return;
  }

  try {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
      priority: 'high',
    };

    const response = await axios.post(
      'https://exp.host/--/api/v2/push/send',
      message,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Push notification sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Push notification failed:', error.response?.data || error.message);
  }
};

/**
 * Send a reminder notification to a user
 * @param {object} reminder - The reminder document
 */
const sendReminderNotification = async (reminder) => {
  try {
    const user = await User.findById(reminder.userId);
    if (!user || !user.expoPushToken) {
      console.warn('⚠️ User or push token not found for reminder:', reminder._id);
      return;
    }

    const title = `🔔 ${reminder.role} at ${reminder.company}`;
    const body = `Your ${reminder.tag} is coming up!`;

    await sendPushNotification(
      user.expoPushToken,
      title,
      body,
      {
        reminderId: reminder._id.toString(),
        type: 'reminder',
      }
    );
  } catch (error) {
    console.error('❌ Error sending reminder notification:', error.message);
  }
};

module.exports = {
  sendPushNotification,
  sendReminderNotification,
};