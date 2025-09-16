const { getRecommendations, getRecommendationsSQL } = require('../services/recommendationService');
const { prisma } = require('../utils/database');

// Get personalized recommendations
const getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    const limit = parseInt(req.query.limit) || 3;
    const useSql = req.query.sql === 'true'; // Option to use SQL-based approach

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    let recommendations;
    
    if (useSql) {
      recommendations = await getRecommendationsSQL(userId, limit);
    } else {
      recommendations = await getRecommendations(userId, limit);
    }

    res.json({
      recommendations,
      userId: parseInt(userId),
      algorithm: useSql ? 'sql-based' : 'prisma-based',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};

// Get popular courses (fallback for new users)
const getPopularCourses = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const popularCourses = await prisma.course.findMany({
      take: limit,
      orderBy: [
        { popularity: 'desc' },
        { enrollmentCount: 'desc' }
      ]
    });

    res.json({
      courses: popularCourses,
      type: 'popular',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get popular courses error:', error);
    res.status(500).json({ error: 'Failed to get popular courses' });
  }
};

// Get recommendations by category
const getRecommendationsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit) || 5;

    // Get courses in the specified category
    const courses = await prisma.course.findMany({
      where: {
        category: {
          equals: category,
          mode: 'insensitive'
        }
      },
      take: limit,
      orderBy: { popularity: 'desc' }
    });

    if (courses.length === 0) {
      return res.status(404).json({ error: 'No courses found in this category' });
    }

    // If user is authenticated, add personalization
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { interests: true, careerInterests: true }
      });

      // Add simple interest matching for category recommendations
      const coursesWithScores = courses.map(course => {
        const userAllInterests = [
          ...(user?.interests || []),
          ...(user?.careerInterests || [])
        ].map(interest => interest.toLowerCase());

        const matches = course.tags.filter(tag => 
          userAllInterests.some(interest => interest === tag.toLowerCase())
        );

        const interestScore = course.tags.length > 0 ? matches.length / course.tags.length : 0;
        
        return {
          ...course,
          interestMatch: Math.round(interestScore * 100) / 100
        };
      });

      // Sort by interest match, then popularity
      coursesWithScores.sort((a, b) => {
        if (b.interestMatch !== a.interestMatch) {
          return b.interestMatch - a.interestMatch;
        }
        return b.popularity - a.popularity;
      });

      return res.json({
        courses: coursesWithScores,
        category,
        personalized: true,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      courses,
      category,
      personalized: false,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get category recommendations error:', error);
    res.status(500).json({ error: 'Failed to get category recommendations' });
  }
};

module.exports = {
  getPersonalizedRecommendations,
  getPopularCourses,
  getRecommendationsByCategory
};