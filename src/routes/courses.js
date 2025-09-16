const express = require('express');
const { 
  getCourses, 
  getCourse, 
  trackView, 
  trackScroll,
  getCategories 
} = require('../controllers/courseController');
const { optionalAuth } = require('../middleware/auth');
const { validateActivityTracking } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management and tracking endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
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
 *         difficulty:
 *           type: string
 *         duration:
 *           type: integer
 *         popularity:
 *           type: integer
 *         enrollmentCount:
 *           type: integer
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *     PaginatedCourses:
 *       type: object
 *       properties:
 *         courses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Course'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             total:
 *               type: integer
 *             pages:
 *               type: integer
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses with pagination and filters
 *     tags: [Courses]
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
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *         description: Filter by difficulty
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for title or description
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedCourses'
 *       500:
 *         description: Server error
 */
router.get('/', optionalAuth, getCourses);

/**
 * @swagger
 * /api/courses/categories:
 *   get:
 *     summary: Get all course categories
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get single course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get('/:id', optionalAuth, getCourse);

/**
 * @swagger
 * /api/courses/{courseId}/view:
 *   post:
 *     summary: Track course view activity
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: User ID
 *     responses:
 *       200:
 *         description: View tracked successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.post('/:courseId/view', validateActivityTracking, trackView);

/**
 * @swagger
 * /api/courses/{courseId}/scroll:
 *   post:
 *     summary: Track scrolling engagement activity
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - duration
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: User ID
 *               duration:
 *                 type: integer
 *                 description: Scroll duration in seconds
 *     responses:
 *       200:
 *         description: Scroll activity tracked successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.post('/:courseId/scroll', validateActivityTracking, trackScroll);

module.exports = router;