// src/jobs/reminderScheduler.js
const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const { sendReminderNotification } = require('../services/pushNotificationService');

/**
 * Runs every minute to check for due reminders
 * Sends push notifications for reminders whose time has come
 * Marks them as sent so they don't trigger again
 */
const startReminderScheduler = () => {
  cron.schedule('* * * * *', async () => {
    console.log('🔍 Checking for due reminders...');
    
    try {
      const now = new Date();
      
      // Find unsent reminders where datetime is in the past
      const dueReminders = await Reminder.find({
        datetime: { $lte: now },
        sent: false,
      });

      if (dueReminders.length === 0) {
        console.log('✅ No due reminders found.');
        return;
      }

      console.log(`📢 Found ${dueReminders.length} due reminder(s). Sending notifications...`);

      for (const reminder of dueReminders) {
        // Send push notification
        await sendReminderNotification(reminder);
        
        // Mark as sent
        reminder.sent = true;
        await reminder.save();
        
        console.log(`✅ Reminder ${reminder._id} marked as sent.`);
      }

      console.log('✅ All due reminders processed.');
    } catch (error) {
      console.error('❌ Error in reminder scheduler:', error.message);
    }
  });

  console.log('⏰ Reminder scheduler started (runs every minute)');
};

module.exports = startReminderScheduler;