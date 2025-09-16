const express = require('express');
const { updateProfile, getActivity, getStats } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and activity endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserActivity:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         courseId:
 *           type: integer
 *         activityType:
 *           type: string
 *         duration:
 *           type: integer
 *         timestamp:
 *           type: string
 *         course:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             title:
 *               type: string
 *             category:
 *               type: string
 *     UserStats:
 *       type: object
 *       properties:
 *         totalViews:
 *           type: integer
 *         totalScrolls:
 *           type: integer
 *         avgScrollTime:
 *           type: integer
 *         uniqueCoursesViewed:
 *           type: integer
 */

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *               careerInterests:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
router.put('/profile', authenticateToken, updateProfile);

/**
 * @swagger
 * /api/users/activity:
 *   get:
 *     summary: Get user activity history
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: User activity history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserActivity'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       500:
 *         description: Server error
 */
router.get('/activity', authenticateToken, getActivity);

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   $ref: '#/components/schemas/UserStats'
 *       500:
 *         description: Server error
 */
router.get('/stats', authenticateToken, getStats);

module.exports = router;