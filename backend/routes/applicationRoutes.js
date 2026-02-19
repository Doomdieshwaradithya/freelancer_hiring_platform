const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    applyForJob, getJobApplications, getMyApplications, acceptApplication, rejectApplication
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middlewares/auth');

// @route   POST /api/applications - Apply for a job (Freelancer only)
router.post('/', protect, authorize('freelancer'), [
    body('jobId', 'Job ID is required').notEmpty(),
    body('proposal', 'Proposal is required').notEmpty()
], applyForJob);

// @route   GET /api/applications/my-applications - Get freelancer's applications
router.get('/my-applications', protect, authorize('freelancer'), getMyApplications);

// @route   GET /api/applications/job/:jobId - Get applications for a specific job (Client only)
router.get('/job/:jobId', protect, authorize('client'), getJobApplications);

// @route   PUT /api/applications/:id/accept - Accept application (Client only)
router.put('/:id/accept', protect, authorize('client'), acceptApplication);

// @route   PUT /api/applications/:id/reject - Reject application (Client only)
router.put('/:id/reject', protect, authorize('client'), rejectApplication);

module.exports = router;
