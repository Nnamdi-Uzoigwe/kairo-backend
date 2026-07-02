// src/controllers/statsController.js
const Application = require('../models/Application');

// Get all stats for the logged-in user
exports.getStats = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Total applications
    const totalApplications = await Application.countDocuments({ userId });

    // 2. Applications by status
    const statusStats = await Application.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // 3. Applications by source
    const sourceStats = await Application.aggregate([
      { $match: { userId } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    // 4. Monthly breakdown
    const monthlyStats = await Application.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            month: { $month: '$appliedDate' },
            year: { $year: '$appliedDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // 5. Response rate (applications that moved past 'applied')
    const responded = await Application.countDocuments({
      userId,
      status: { $in: ['assessment', 'interviewing', 'offer', 'rejected'] },
    });
    const responseRate = totalApplications > 0 
      ? Math.round((responded / totalApplications) * 100) 
      : 0;

    // 6. Average days to response (simplified)
    // In a real app, you'd track status change dates
    const avgDays = 4.2; // placeholder for now

    res.json({
      totalApplications,
      statusStats,
      sourceStats,
      monthlyStats,
      responseRate,
      avgDays,
      totalOffers: statusStats.find(s => s._id === 'offer')?.count || 0,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};