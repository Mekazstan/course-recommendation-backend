require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.userActivity.deleteMany();
  await prisma.user.deleteMany();
  await prisma.course.deleteMany();

  console.log('🧹 Cleared existing data');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // 1. Create diverse users with different interests
  const users = await Promise.all([
    // Tech enthusiasts
    prisma.user.create({
      data: {
        email: 'john.programmer@example.com',
        password: hashedPassword,
        name: 'John Developer',
        interests: ['programming', 'javascript', 'web-development', 'react'],
        careerInterests: ['software-engineer', 'frontend-developer', 'full-stack-developer']
      }
    }),

    prisma.user.create({
      data: {
        email: 'sarah.datascientist@example.com',
        password: hashedPassword,
        name: 'Sarah Analytics',
        interests: ['data-science', 'python', 'machine-learning', 'statistics'],
        careerInterests: ['data-scientist', 'ml-engineer', 'data-analyst']
      }
    }),

    // Design & Business users
    prisma.user.create({
      data: {
        email: 'mike.designer@example.com',
        password: hashedPassword,
        name: 'Mike Creative',
        interests: ['design', 'ui-ux', 'figma', 'photoshop'],
        careerInterests: ['ui-designer', 'ux-designer', 'product-designer']
      }
    }),

    prisma.user.create({
      data: {
        email: 'lisa.business@example.com',
        password: hashedPassword,
        name: 'Lisa Strategy',
        interests: ['business', 'marketing', 'strategy', 'analytics'],
        careerInterests: ['product-manager', 'marketing-manager', 'business-analyst']
      }
    }),

    // Mixed interests user
    prisma.user.create({
      data: {
        email: 'alex.explorer@example.com',
        password: hashedPassword,
        name: 'Alex Explorer',
        interests: ['programming', 'design', 'entrepreneurship'],
        careerInterests: ['product-manager', 'startup-founder']
      }
    }),

    // New user with minimal interests
    prisma.user.create({
      data: {
        email: 'newbie@example.com',
        password: hashedPassword,
        name: 'New User',
        interests: ['learning'],
        careerInterests: ['career-change']
      }
    })
  ]);

  console.log(`✅ Created ${users.length} users`);

  // 2. Create diverse courses across categories
  const courses = await Promise.all([
    // Programming Courses
    prisma.course.create({
      data: {
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming from scratch',
        category: 'Programming',
        tags: ['javascript', 'programming', 'web-development', 'frontend'],
        difficulty: 'beginner',
        popularity: 95,
        enrollmentCount: 2500
      }
    }),

    prisma.course.create({
      data: {
        title: 'React Complete Guide',
        description: 'Master React.js with hooks, context, and modern patterns',
        category: 'Programming',
        tags: ['react', 'javascript', 'frontend', 'web-development', 'hooks'],
        difficulty: 'intermediate',
        popularity: 92,
        enrollmentCount: 1800
      }
    }),

    prisma.course.create({
      data: {
        title: 'Node.js Backend Development',
        description: 'Build scalable backend applications with Node.js and Express',
        category: 'Programming',
        tags: ['nodejs', 'javascript', 'backend', 'express', 'api'],
        difficulty: 'intermediate',
        popularity: 88,
        enrollmentCount: 1200
      }
    }),

    prisma.course.create({
      data: {
        title: 'Python for Beginners',
        description: 'Start your programming journey with Python',
        category: 'Programming',
        tags: ['python', 'programming', 'beginner', 'basics'],
        difficulty: 'beginner',
        popularity: 90,
        enrollmentCount: 3200
      }
    }),

    prisma.course.create({
      data: {
        title: 'Full Stack Web Development',
        description: 'Complete web development with React, Node.js, and MongoDB',
        category: 'Programming',
        tags: ['fullstack', 'react', 'nodejs', 'mongodb', 'web-development'],
        difficulty: 'advanced',
        popularity: 85,
        enrollmentCount: 950
      }
    }),

    // Data Science Courses
    prisma.course.create({
      data: {
        title: 'Data Science with Python',
        description: 'Learn data analysis, visualization, and machine learning with Python',
        category: 'Data Science',
        tags: ['python', 'data-science', 'pandas', 'numpy', 'machine-learning'],
        difficulty: 'intermediate',
        popularity: 89,
        enrollmentCount: 1600
      }
    }),

    prisma.course.create({
      data: {
        title: 'Machine Learning Fundamentals',
        description: 'Understand ML algorithms and their practical applications',
        category: 'Data Science',
        tags: ['machine-learning', 'ai', 'algorithms', 'python', 'statistics'],
        difficulty: 'intermediate',
        popularity: 87,
        enrollmentCount: 1100
      }
    }),

    prisma.course.create({
      data: {
        title: 'SQL for Data Analysis',
        description: 'Master SQL queries for data analysis and reporting',
        category: 'Data Science',
        tags: ['sql', 'database', 'data-analysis', 'reporting'],
        difficulty: 'beginner',
        popularity: 84,
        enrollmentCount: 2100
      }
    }),

    prisma.course.create({
      data: {
        title: 'Advanced Analytics with R',
        description: 'Statistical analysis and data visualization with R',
        category: 'Data Science',
        tags: ['r', 'statistics', 'analytics', 'visualization', 'data-science'],
        difficulty: 'advanced',
        popularity: 76,
        enrollmentCount: 680
      }
    }),

    // Design Courses
    prisma.course.create({
      data: {
        title: 'UI/UX Design Principles',
        description: 'Learn modern design principles and user experience best practices',
        category: 'Design',
        tags: ['ui', 'ux', 'design', 'figma', 'user-experience'],
        difficulty: 'beginner',
        popularity: 82,
        enrollmentCount: 1900
      }
    }),

    prisma.course.create({
      data: {
        title: 'Advanced Figma Mastery',
        description: 'Master Figma for professional UI/UX design workflows',
        category: 'Design',
        tags: ['figma', 'design', 'prototyping', 'ui', 'design-systems'],
        difficulty: 'intermediate',
        popularity: 79,
        enrollmentCount: 1300
      }
    }),

    prisma.course.create({
      data: {
        title: 'Adobe Creative Suite',
        description: 'Complete guide to Photoshop, Illustrator, and InDesign',
        category: 'Design',
        tags: ['photoshop', 'illustrator', 'adobe', 'graphic-design'],
        difficulty: 'intermediate',
        popularity: 75,
        enrollmentCount: 1050
      }
    }),

    prisma.course.create({
      data: {
        title: 'Web Design Fundamentals',
        description: 'Learn HTML, CSS, and responsive design principles',
        category: 'Design',
        tags: ['html', 'css', 'web-design', 'responsive', 'frontend'],
        difficulty: 'beginner',
        popularity: 86,
        enrollmentCount: 2200
      }
    }),

    // Business & Marketing Courses
    prisma.course.create({
      data: {
        title: 'Digital Marketing Strategy',
        description: 'Complete digital marketing from social media to SEO',
        category: 'Marketing',
        tags: ['marketing', 'digital-marketing', 'seo', 'social-media', 'strategy'],
        difficulty: 'beginner',
        popularity: 83,
        enrollmentCount: 1750
      }
    }),

    prisma.course.create({
      data: {
        title: 'Product Management Essentials',
        description: 'Learn to build and manage successful products',
        category: 'Business',
        tags: ['product-management', 'strategy', 'agile', 'business', 'leadership'],
        difficulty: 'intermediate',
        popularity: 78,
        enrollmentCount: 1400
      }
    }),

    prisma.course.create({
      data: {
        title: 'Business Analytics',
        description: 'Use data to make better business decisions',
        category: 'Business',
        tags: ['analytics', 'business', 'data-analysis', 'excel', 'reporting'],
        difficulty: 'intermediate',
        popularity: 74,
        enrollmentCount: 980
      }
    }),

    prisma.course.create({
      data: {
        title: 'Startup Fundamentals',
        description: 'Everything you need to know to start your own company',
        category: 'Business',
        tags: ['startup', 'entrepreneurship', 'business-plan', 'funding'],
        difficulty: 'beginner',
        popularity: 71,
        enrollmentCount: 850
      }
    }),

    // Emerging Tech Courses
    prisma.course.create({
      data: {
        title: 'Blockchain Development',
        description: 'Build decentralized applications with Ethereum and Solidity',
        category: 'Programming',
        tags: ['blockchain', 'ethereum', 'solidity', 'web3', 'cryptocurrency'],
        difficulty: 'advanced',
        popularity: 72,
        enrollmentCount: 650
      }
    }),

    prisma.course.create({
      data: {
        title: 'AI and ChatGPT for Professionals',
        description: 'Leverage AI tools to boost productivity in your career',
        category: 'Technology',
        tags: ['ai', 'chatgpt', 'automation', 'productivity', 'future-skills'],
        difficulty: 'beginner',
        popularity: 94,
        enrollmentCount: 2800
      }
    }),

    // Niche/Lower popularity courses
    prisma.course.create({
      data: {
        title: 'Game Development with Unity',
        description: 'Create 2D and 3D games using Unity and C#',
        category: 'Programming',
        tags: ['unity', 'game-development', 'csharp', 'gaming'],
        difficulty: 'intermediate',
        popularity: 68,
        enrollmentCount: 720
      }
    })
  ]);

  console.log(`✅ Created ${courses.length} courses`);

  // 3. Create realistic user activities with different patterns
  const activities = [];

  // John (JavaScript enthusiast) - Heavy engagement with JS/React courses
  const john = users[0];
  const jsBasics = courses[0]; // JavaScript Fundamentals
  const reactCourse = courses[1]; // React Complete Guide
  const nodeCourse = courses[2]; // Node.js Backend

  // John loves JavaScript - viewed and scrolled multiple times
  for (let i = 0; i < 5; i++) {
    activities.push(
      // Views over the past week
      {
        userId: john.id,
        courseId: jsBasics.id,
        activityType: 'view',
        timestamp: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)) // Past 5 days
      },
      // Good engagement times
      {
        userId: john.id,
        courseId: jsBasics.id,
        activityType: 'scroll',
        duration: Math.floor(Math.random() * 60) + 30, // 30-90 seconds
        timestamp: new Date(Date.now() - (i * 24 * 60 * 60 * 1000))
      }
    );
  }

  // John viewed React course recently
  for (let i = 0; i < 3; i++) {
    activities.push(
      {
        userId: john.id,
        courseId: reactCourse.id,
        activityType: 'view',
        timestamp: new Date(Date.now() - (i * 12 * 60 * 60 * 1000)) // Past 36 hours
      },
      {
        userId: john.id,
        courseId: reactCourse.id,
        activityType: 'scroll',
        duration: Math.floor(Math.random() * 80) + 40, // 40-120 seconds
        timestamp: new Date(Date.now() - (i * 12 * 60 * 60 * 1000))
      }
    );
  }

  // Sarah (Data Science) - Strong interest in Python/ML courses
  const sarah = users[1];
  const pythonCourse = courses[3]; // Python for Beginners
  const dataScienceCourse = courses[5]; // Data Science with Python
  const mlCourse = courses[6]; // Machine Learning Fundamentals

  // Sarah's activity pattern
  for (let i = 0; i < 4; i++) {
    activities.push(
      {
        userId: sarah.id,
        courseId: dataScienceCourse.id,
        activityType: 'view',
        timestamp: new Date(Date.now() - (i * 18 * 60 * 60 * 1000)) // Past 72 hours
      },
      {
        userId: sarah.id,
        courseId: dataScienceCourse.id,
        activityType: 'scroll',
        duration: Math.floor(Math.random() * 100) + 50, // 50-150 seconds
        timestamp: new Date(Date.now() - (i * 18 * 60 * 60 * 1000))
      }
    );
  }

  // Sarah also looked at ML course
  for (let i = 0; i < 2; i++) {
    activities.push(
      {
        userId: sarah.id,
        courseId: mlCourse.id,
        activityType: 'view',
        timestamp: new Date(Date.now() - (i * 36 * 60 * 60 * 1000))
      },
      {
        userId: sarah.id,
        courseId: mlCourse.id,
        activityType: 'scroll',
        duration: Math.floor(Math.random() * 70) + 25, // 25-95 seconds
        timestamp: new Date(Date.now() - (i * 36 * 60 * 60 * 1000))
      }
    );
  }

  // Mike (Designer) - Focused on design courses
  const mike = users[2];
  const uiUxCourse = courses[9]; // UI/UX Design Principles
  const figmaCourse = courses[10]; // Advanced Figma Mastery

  // Mike's design-focused activity
  for (let i = 0; i < 6; i++) {
    activities.push(
      {
        userId: mike.id,
        courseId: uiUxCourse.id,
        activityType: 'view',
        timestamp: new Date(Date.now() - (i * 20 * 60 * 60 * 1000))
      },
      {
        userId: mike.id,
        courseId: uiUxCourse.id,
        activityType: 'scroll',
        duration: Math.floor(Math.random() * 90) + 35, // 35-125 seconds
        timestamp: new Date(Date.now() - (i * 20 * 60 * 60 * 1000))
      }
    );
  }

  // Lisa (Business) - Mixed business/marketing interest
  const lisa = users[3];
  const digitalMarketingCourse = courses[13]; // Digital Marketing Strategy
  const productMgmtCourse = courses[14]; // Product Management Essentials
  const businessAnalyticsCourse = courses[15]; // Business Analytics

  // Lisa's business-focused activity
  activities.push(
    ...Array.from({ length: 3 }, (_, i) => [
      {
        userId: lisa.id,
        courseId: digitalMarketingCourse.id,
        activityType: 'view',
        timestamp: new Date(Date.now() - (i * 48 * 60 * 60 * 1000))
      },
      {
        userId: lisa.id,
        courseId: digitalMarketingCourse.id,
        activityType: 'scroll',
        duration: Math.floor(Math.random() * 60) + 20,
        timestamp: new Date(Date.now() - (i * 48 * 60 * 60 * 1000))
      }
    ]).flat()
  );

  // Alex (Mixed interests) - Diverse viewing pattern
  const alex = users[4];
  
  // Alex views courses across categories (lower engagement)
  const alexCourses = [jsBasics, uiUxCourse, productMgmtCourse, courses[18]]; // AI course
  
  alexCourses.forEach((course, courseIndex) => {
    for (let i = 0; i < 2; i++) {
      activities.push(
        {
          userId: alex.id,
          courseId: course.id,
          activityType: 'view',
          timestamp: new Date(Date.now() - ((courseIndex * 2 + i) * 24 * 60 * 60 * 1000))
        },
        {
          userId: alex.id,
          courseId: course.id,
          activityType: 'scroll',
          duration: Math.floor(Math.random() * 40) + 15, // Lower engagement: 15-55 seconds
          timestamp: new Date(Date.now() - ((courseIndex * 2 + i) * 24 * 60 * 60 * 1000))
        }
      );
    }
  });

  // Newbie user - Very limited activity (only popular courses)
  const newbie = users[5];
  const aiCourse = courses[18]; // AI and ChatGPT (most popular)
  
  activities.push(
    {
      userId: newbie.id,
      courseId: aiCourse.id,
      activityType: 'view',
      timestamp: new Date(Date.now() - (2 * 60 * 60 * 1000)) // 2 hours ago
    },
    {
      userId: newbie.id,
      courseId: aiCourse.id,
      activityType: 'scroll',
      duration: 10, // Very brief engagement
      timestamp: new Date(Date.now() - (2 * 60 * 60 * 1000))
    }
  );

  // Add some random activities for other courses to simulate general popularity
  const allUserCombinations = [];
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < courses.length; j++) {
      if (Math.random() < 0.1) { // 10% chance of random interaction
        allUserCombinations.push({
          userId: users[i].id,
          courseId: courses[j].id,
          activityType: 'view',
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random time within 30 days
        });
      }
    }
  }

  activities.push(...allUserCombinations);

  // Insert all activities
  await prisma.userActivity.createMany({
    data: activities
  });

  console.log(`✅ Created ${activities.length} user activities`);

  // 4. Display summary
  console.log('\n🎉 Database seeding completed!');
  console.log('\n📊 Summary:');
  console.log(`👥 Users: ${users.length}`);
  console.log(`📚 Courses: ${courses.length}`);
  console.log(`📈 Activities: ${activities.length}`);

  console.log('\n🧪 Test Users for Different Scenarios:');
  console.log('1. john.programmer@example.com - Heavy JavaScript/React engagement');
  console.log('2. sarah.datascientist@example.com - Data Science focused');
  console.log('3. mike.designer@example.com - Design/UX focused');
  console.log('4. lisa.business@example.com - Business/Marketing focused');
  console.log('5. alex.explorer@example.com - Mixed interests, lower engagement');
  console.log('6. newbie@example.com - New user with minimal activity');
  console.log('\nPassword for all users: password123');

  console.log('\n🔗 Test Recommendation APIs:');
  console.log('GET /api/recommendations (with user auth)');
  console.log('GET /api/recommendations/user/1');
  console.log('GET /api/recommendations/popular');
  console.log('GET /api/recommendations/category/Programming');

  // Show some sample data for verification
  const sampleActivities = await prisma.userActivity.findMany({
    take: 5,
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true, category: true } }
    },
    orderBy: { timestamp: 'desc' }
  });

  console.log('\n📋 Sample Recent Activities:');
  sampleActivities.forEach(activity => {
    console.log(`${activity.user.name} ${activity.activityType} "${activity.course.title}" ${activity.duration ? `(${activity.duration}s)` : ''}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });