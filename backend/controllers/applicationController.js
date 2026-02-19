const Application = require('../models/Application');
const Job = require('../models/Job');
const { validationResult } = require('express-validator');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Freelancer only)
const applyForJob = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { jobId, proposal, bidAmount } = req.body;

        // Check if job exists and is open
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        if (job.status !== 'open') {
            return res.status(400).json({ message: 'This job is no longer accepting applications' });
        }

        // Check if freelancer already applied
        const existingApplication = await Application.findOne({
            jobId,
            freelancerId: req.user._id
        });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Create application
        const application = await Application.create({
            jobId,
            freelancerId: req.user._id,
            proposal,
            bidAmount
        });

        res.status(201).json(application);
    } catch (error) {
        console.error('Apply for job error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get applications for a job (Client view)
// @route   GET /api/applications/job/:jobId
// @access  Private (Client who owns the job)
const getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Only the client who posted the job can see applications
        if (job.clientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view these applications' });
        }

        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('freelancerId', 'name email profileImage skills hourlyRate bio experience')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error('Get job applications error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get freelancer's applications (My applications)
// @route   GET /api/applications/my-applications
// @access  Private (Freelancer)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ freelancerId: req.user._id })
            .populate({
                path: 'jobId',
                select: 'title description budget status clientId',
                populate: { path: 'clientId', select: 'name email' }
            })
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error('Get my applications error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Accept an application (hire freelancer)
// @route   PUT /api/applications/:id/accept
// @access  Private (Client)
const acceptApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Get the job to verify ownership
        const job = await Job.findById(application.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        if (job.clientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Accept this application
        application.status = 'accepted';
        await application.save();

        // Update job status and assign freelancer
        job.status = 'in-progress';
        job.hiredFreelancer = application.freelancerId;
        await job.save();

        // Reject all other pending applications for this job
        await Application.updateMany(
            { jobId: application.jobId, _id: { $ne: application._id }, status: 'pending' },
            { status: 'rejected' }
        );

        res.json({ message: 'Application accepted, freelancer hired!', application });
    } catch (error) {
        console.error('Accept application error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Reject an application
// @route   PUT /api/applications/:id/reject
// @access  Private (Client)
const rejectApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const job = await Job.findById(application.jobId);
        if (job.clientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        application.status = 'rejected';
        await application.save();

        res.json({ message: 'Application rejected', application });
    } catch (error) {
        console.error('Reject application error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { applyForJob, getJobApplications, getMyApplications, acceptApplication, rejectApplication };
