const express = require('express');
const { 
  getPersonalizedRecommendations, 
  getPopularCourses,
  getRecommendationsByCategory 
} = require('../controllers/recommendationController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: Personalized course recommendation endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Recommendation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         recommendationScore:
 *           type: number
 *         scoreBreakdown:
 *           type: object
 *           properties:
 *             interest:
 *               type: number
 *             engagement:
 *               type: number
 *             views:
 *               type: number
 *             popularity:
 *               type: number
 */

/**
 * @swagger
 * /api/recommendations:
 *   get:
 *     summary: Get personalized recommendations for authenticated user
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of recommendations to return
 *       - in: query
 *         name: sql
 *         schema:
 *           type: boolean
 *         description: Use SQL-based algorithm instead of Prisma
 *     responses:
 *       200:
 *         description: Personalized recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recommendation'
 *                 userId:
 *                   type: integer
 *                 algorithm:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, getPersonalizedRecommendations);

/**
 * @swagger
 * /api/recommendations/user/{userId}:
 *   get:
 *     summary: Get recommendations for specific user (testing endpoint)
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of recommendations to return
 *       - in: query
 *         name: sql
 *         schema:
 *           type: boolean
 *         description: Use SQL-based algorithm instead of Prisma
 *     responses:
 *       200:
 *         description: User recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recommendation'
 *                 userId:
 *                   type: integer
 *                 algorithm:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/user/:userId', getPersonalizedRecommendations);

/**
 * @swagger
 * /api/recommendations/popular:
 *   get:
 *     summary: Get popular courses (public endpoint)
 *     tags: [Recommendations]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of courses to return
 *     responses:
 *       200:
 *         description: Popular courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 type:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.get('/popular', getPopularCourses);

/**
 * @swagger
 * /api/recommendations/category/{category}:
 *   get:
 *     summary: Get recommendations by category
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Course category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of recommendations to return
 *     responses:
 *       200:
 *         description: Category recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 category:
 *                   type: string
 *                 personalized:
 *                   type: boolean
 *                 timestamp:
 *                   type: string
 *       404:
 *         description: No courses found in category
 *       500:
 *         description: Server error
 */
router.get('/category/:category', optionalAuth, getRecommendationsByCategory);

module.exports = router;