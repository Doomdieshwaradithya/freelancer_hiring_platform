const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createJob, getJobs, getJobById, updateJob, deleteJob, getMyJobs, completeJob
} = require('../controllers/jobController');
const { protect, authorize } = require('../middlewares/auth');

// @route   GET /api/jobs - Get all jobs (public)
router.get('/', getJobs);

// @route   GET /api/jobs/my-jobs - Get client's own jobs
router.get('/my-jobs', protect, authorize('client'), getMyJobs);

// @route   GET /api/jobs/:id - Get single job
router.get('/:id', getJobById);

// @route   POST /api/jobs - Create job (Client only)
router.post('/', protect, authorize('client'), [
    body('title', 'Title is required').notEmpty(),
    body('description', 'Description is required').notEmpty(),
    body('budget', 'Budget must be a number').isNumeric(),
    body('skillsRequired', 'Skills are required').isArray({ min: 1 })
], createJob);

// @route   PUT /api/jobs/:id - Update job (Client only)
router.put('/:id', protect, authorize('client'), updateJob);

// @route   PUT /api/jobs/:id/complete - Mark job as completed
router.put('/:id/complete', protect, authorize('client'), completeJob);

// @route   DELETE /api/jobs/:id - Delete job (Client only)
router.delete('/:id', protect, authorize('client'), deleteJob);

module.exports = router;
