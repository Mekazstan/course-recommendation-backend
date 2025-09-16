const { prisma } = require('../utils/database');

// Calculate interest matching score
const calculateInterestScore = (userInterests, userCareerInterests, courseTags) => {
  if (!courseTags || courseTags.length === 0) return 0;
  
  const userAllInterests = [
    ...(userInterests || []),
    ...(userCareerInterests || [])
  ].map(interest => interest.toLowerCase());
  
  const matches = courseTags.filter(tag => 
    userAllInterests.some(interest => 
      interest === tag.toLowerCase() || 
      tag.toLowerCase().includes(interest) ||
      interest.includes(tag.toLowerCase())
    )
  );
  
  return matches.length / courseTags.length;
};

// Calculate engagement score based on scroll activities
const calculateEngagementScore = async (userId, courseId) => {
  try {
    const scrollActivities = await prisma.userActivity.findMany({
      where: {
        userId: parseInt(userId),
        courseId: parseInt(courseId),
        activityType: 'scroll',
        duration: { not: null }
      }
    });

    if (scrollActivities.length === 0) return 0;

    const totalScrollTime = scrollActivities.reduce((sum, activity) => 
      sum + (activity.duration || 0), 0);
    const avgScrollTime = totalScrollTime / scrollActivities.length;

    // Normalize to 0-1 scale (60 seconds = max score)
    return Math.min(avgScrollTime / 60, 1);

  } catch (error) {
    console.error('Error calculating engagement score:', error);
    return 0;
  }
};

// Calculate view frequency and recency score
const calculateViewScore = async (userId, courseId) => {
  try {
    const views = await prisma.userActivity.findMany({
      where: {
        userId: parseInt(userId),
        courseId: parseInt(courseId),
        activityType: 'view'
      },
      orderBy: { timestamp: 'desc' }
    });

    if (views.length === 0) return 0;

    const viewCount = views.length;
    const mostRecentView = views[0].timestamp;

    // Frequency score (logarithmic scaling)
    const frequencyScore = Math.min(Math.log(viewCount + 1) / Math.log(10), 1);

    // Recency score (exponential decay over 7 days)
    const daysSinceLastView = (Date.now() - mostRecentView.getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.exp(-daysSinceLastView / 7);

    return (frequencyScore + recencyScore) / 2;

  } catch (error) {
    console.error('Error calculating view score:', error);
    return 0;
  }
};

// Get maximum popularity for normalization
const getMaxPopularity = async () => {
  try {
    const maxPopularityCourse = await prisma.course.findFirst({
      orderBy: { popularity: 'desc' },
      select: { popularity: true }
    });
    return maxPopularityCourse?.popularity || 1;
  } catch (error) {
    console.error('Error getting max popularity:', error);
    return 1;
  }
};

// Main recommendation function
const getRecommendations = async (userId, limit = 3) => {
  try {
    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        interests: true,
        careerInterests: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get all courses
    const courses = await prisma.course.findMany();
    
    // Get max popularity for normalization
    const maxPopularity = await getMaxPopularity();

    // Calculate scores for each course
    const courseScores = await Promise.all(courses.map(async (course) => {
      // Calculate individual scores
      const interestScore = calculateInterestScore(
        user.interests,
        user.careerInterests,
        course.tags
      );

      const engagementScore = await calculateEngagementScore(userId, course.id);
      const viewScore = await calculateViewScore(userId, course.id);
      const popularityScore = course.popularity / maxPopularity;

      // Weighted total score
      const totalScore = (
        interestScore * 0.25 +      // 25% - Interest matching
        engagementScore * 0.30 +    // 30% - Engagement signals
        viewScore * 0.25 +          // 25% - View frequency & recency
        popularityScore * 0.20      // 20% - Course popularity
      );

      return {
        course,
        score: totalScore,
        breakdown: {
          interest: Math.round(interestScore * 100) / 100,
          engagement: Math.round(engagementScore * 100) / 100,
          views: Math.round(viewScore * 100) / 100,
          popularity: Math.round(popularityScore * 100) / 100
        }
      };
    }));

    // Sort by score and return top courses
    const topRecommendations = courseScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => ({
        ...item.course,
        recommendationScore: Math.round(item.score * 100) / 100,
        scoreBreakdown: item.breakdown
      }));

    return topRecommendations;

  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

// SQL-based recommendation for better performance (alternative approach)
const getRecommendationsSQL = async (userId, limit = 3) => {
  try {
    const recommendations = await prisma.$queryRaw`
      WITH user_course_stats AS (
        SELECT 
          c.id,
          c.title,
          c.description,
          c.category,
          c.tags,
          c.difficulty,
          c.popularity,
          c.enrollment_count,
          c.created_at,
          COALESCE(view_stats.view_count, 0) as view_count,
          COALESCE(scroll_stats.avg_scroll_time, 0) as avg_scroll_time,
          COALESCE(view_stats.last_view, NOW() - INTERVAL '30 days') as last_view,
          (SELECT MAX(popularity) FROM courses) as max_popularity
        FROM courses c
        LEFT JOIN (
          SELECT 
            course_id,
            COUNT(*) as view_count,
            MAX(timestamp) as last_view
          FROM user_activities 
          WHERE user_id = ${parseInt(userId)} AND activity_type = 'view'
          GROUP BY course_id
        ) view_stats ON c.id = view_stats.course_id
        LEFT JOIN (
          SELECT 
            course_id,
            AVG(duration) as avg_scroll_time
          FROM user_activities 
          WHERE user_id = ${parseInt(userId)} AND activity_type = 'scroll' AND duration IS NOT NULL
          GROUP BY course_id
        ) scroll_stats ON c.id = scroll_stats.course_id
      ),
      scored_courses AS (
        SELECT 
          *,
          -- Engagement score (30%)
          LEAST(COALESCE(avg_scroll_time / 60.0, 0), 1) * 0.30 as engagement_score,
          
          -- View score (25%) - frequency + recency
          ((LEAST(LN(view_count + 1) / LN(10), 1) + 
            EXP(-EXTRACT(EPOCH FROM (NOW() - last_view)) / (7 * 24 * 3600))) / 2) * 0.25 as view_score,
          
          -- Popularity score (20%)
          (popularity::float / GREATEST(max_popularity, 1)) * 0.20 as popularity_score
          
        FROM user_course_stats
      )
      SELECT 
        id,
        title,
        description,
        category,
        tags,
        difficulty,
        popularity,
        enrollment_count,
        created_at,
        ROUND((engagement_score + view_score + popularity_score)::numeric, 3) as recommendation_score,
        ROUND(engagement_score::numeric, 3) as engagement_component,
        ROUND(view_score::numeric, 3) as view_component,
        ROUND(popularity_score::numeric, 3) as popularity_component
      FROM scored_courses
      ORDER BY recommendation_score DESC
      LIMIT ${limit}
    `;

    return recommendations;

  } catch (error) {
    console.error('Error getting SQL recommendations:', error);
    throw error;
  }
};

module.exports = {
  getRecommendations,
  getRecommendationsSQL,
  calculateInterestScore,
  calculateEngagementScore,
  calculateViewScore
};