const { prisma } = require('../utils/database');

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, interests, careerInterests } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (name) updateData.name = name;
    if (interests) updateData.interests = interests;
    if (careerInterests) updateData.careerInterests = careerInterests;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        interests: true,
        careerInterests: true,
        createdAt: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Get user activity history
const getActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      prisma.userActivity.findMany({
        where: { userId },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              category: true
            }
          }
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit
      }),
      prisma.userActivity.count({ where: { userId } })
    ]);

    res.json({
      activities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
};

// Get user stats
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await prisma.userActivity.groupBy({
      by: ['activityType'],
      where: { userId },
      _count: { activityType: true },
      _avg: { duration: true }
    });

    const totalViews = stats.find(s => s.activityType === 'view')?._count.activityType || 0;
    const totalScrolls = stats.find(s => s.activityType === 'scroll')?._count.activityType || 0;
    const avgScrollTime = stats.find(s => s.activityType === 'scroll')?._avg.duration || 0;

    // Get unique courses viewed
    const uniqueCourses = await prisma.userActivity.findMany({
      where: { userId, activityType: 'view' },
      select: { courseId: true },
      distinct: ['courseId']
    });

    res.json({
      stats: {
        totalViews,
        totalScrolls,
        avgScrollTime: Math.round(avgScrollTime || 0),
        uniqueCoursesViewed: uniqueCourses.length
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
};

module.exports = {
  updateProfile,
  getActivity,
  getStats
};