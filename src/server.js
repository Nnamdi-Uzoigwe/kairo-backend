require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // ✅ Import DB connection
const authRoutes = require('./routes/authRoutes'); // ✅ Import auth routes
const applicationRoutes = require('./routes/applicationRoutes'); // ✅ Import application routes
const reminderRoutes = require('./routes/reminderRoutes'); // ✅ Import reminder routes
const notificationRoutes = require('./routes/notificationRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Import cron job
const startReminderScheduler = require('./jobs/reminderScheduler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB(); // ✅ Call it here

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Kairo backend is running' });
});

// Start the reminder scheduler
startReminderScheduler();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});