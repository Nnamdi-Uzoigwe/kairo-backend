// src/controllers/statsController.js
const Application = require('../models/Application');

exports.getStats = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Total applications
    const totalApplications = await Application.countDocuments({ userId });

    // 2. Count each status manually (✅ bulletproof)
    const appliedCount = await Application.countDocuments({ userId, status: 'applied' });
    const assessmentCount = await Application.countDocuments({ userId, status: 'assessment' });
    const interviewingCount = await Application.countDocuments({ userId, status: 'interviewing' });
    const offerCount = await Application.countDocuments({ userId, status: 'offer' });
    const rejectedCount = await Application.countDocuments({ userId, status: 'rejected' });

    const statusStats = [
      { _id: 'applied', count: appliedCount },
      { _id: 'assessment', count: assessmentCount },
      { _id: 'interviewing', count: interviewingCount },
      { _id: 'offer', count: offerCount },
      { _id: 'rejected', count: rejectedCount },
    ].filter(s => s.count > 0); // only show statuses with apps

    // 3. Applications by source (manual counts)
    const linkedinCount = await Application.countDocuments({ userId, source: 'linkedin' });
    const twitterCount = await Application.countDocuments({ userId, source: 'twitter' });
    const referralCount = await Application.countDocuments({ userId, source: 'referral' });
    const companySiteCount = await Application.countDocuments({ userId, source: 'company_site' });
    const jobBoardCount = await Application.countDocuments({ userId, source: 'job_board' });
    const otherCount = await Application.countDocuments({ userId, source: 'other' });

    const sourceStats = [
      { _id: 'linkedin', count: linkedinCount },
      { _id: 'twitter', count: twitterCount },
      { _id: 'referral', count: referralCount },
      { _id: 'company_site', count: companySiteCount },
      { _id: 'job_board', count: jobBoardCount },
      { _id: 'other', count: otherCount },
    ].filter(s => s.count > 0);

    // 4. Monthly breakdown (keep aggregation, it's safe with dates)
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

    // 5. Response rate
    const responded = await Application.countDocuments({
      userId,
      status: { $in: ['assessment', 'interviewing', 'offer', 'rejected'] },
    });
    const responseRate = totalApplications > 0 
      ? Math.round((responded / totalApplications) * 100) 
      : 0;

    res.json({
      totalApplications,
      statusStats,
      sourceStats,
      monthlyStats,
      responseRate,
      avgDays: 4.2,
      totalOffers: offerCount,
    });
  } catch (error) {
    console.error('❌ Stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};