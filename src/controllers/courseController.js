const { prisma } = require('../utils/database');

// Get all courses with pagination
const getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { category, difficulty, search } = req.query;

    // Build where clause
    const where = {};
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { popularity: 'desc' }
      }),
      prisma.course.count({ where })
    ]);

    res.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Get single course by ID
const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

// Track course view
const trackView = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Track view activity
    await prisma.userActivity.create({
      data: {
        userId: parseInt(userId),
        courseId: parseInt(courseId),
        activityType: 'view'
      }
    });

    res.json({ message: 'View tracked successfully' });

  } catch (error) {
    console.error('Track view error:', error);
    res.status(500).json({ error: 'Failed to track view' });
  }
};

// Track scrolling engagement
const trackScroll = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId, duration } = req.body;

    if (!duration || duration < 0) {
      return res.status(400).json({ error: 'Valid duration is required' });
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Track scroll activity
    await prisma.userActivity.create({
      data: {
        userId: parseInt(userId),
        courseId: parseInt(courseId),
        activityType: 'scroll',
        duration: parseInt(duration)
      }
    });

    res.json({ message: 'Scroll activity tracked successfully' });

  } catch (error) {
    console.error('Track scroll error:', error);
    res.status(500).json({ error: 'Failed to track scroll activity' });
  }
};

// Get course categories
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.course.findMany({
      select: { category: true },
      distinct: ['category'],
      where: { category: { not: null } }
    });

    const categoryList = categories.map(c => c.category).filter(Boolean);

    res.json({ categories: categoryList });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

module.exports = {
  getCourses,
  getCourse,
  trackView,
  trackScroll,
  getCategories
};