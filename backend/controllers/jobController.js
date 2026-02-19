const Job = require('../models/Job');
const { validationResult } = require('express-validator');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Client only)
const createJob = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, budget, skillsRequired, category, duration } = req.body;

        const job = await Job.create({
            title,
            description,
            budget,
            skillsRequired,
            category,
            duration,
            clientId: req.user._id
        });

        res.status(201).json(job);
    } catch (error) {
        console.error('Create job error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all jobs (with optional filters)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const { skill, minBudget, maxBudget, status, search, category } = req.query;

        // Build filter query
        let filter = {};

        // Filter by status (default: show open jobs)
        if (status) {
            filter.status = status;
        }

        // Filter by skill
        if (skill) {
            filter.skillsRequired = { $in: [new RegExp(skill, 'i')] };
        }

        // Filter by budget range
        if (minBudget || maxBudget) {
            filter.budget = {};
            if (minBudget) filter.budget.$gte = Number(minBudget);
            if (maxBudget) filter.budget.$lte = Number(maxBudget);
        }

        // Search by title
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        // Filter by category
        if (category) {
            filter.category = { $regex: category, $options: 'i' };
        }

        const jobs = await Job.find(filter)
            .populate('clientId', 'name email profileImage')
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        console.error('Get jobs error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('clientId', 'name email profileImage location')
            .populate('hiredFreelancer', 'name email profileImage');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json(job);
    } catch (error) {
        console.error('Get job error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Client who created it)
const updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user is the owner of this job
        if (job.clientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        // Update job fields
        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(job);
    } catch (error) {
        console.error('Update job error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Client who created it)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user is the owner of this job
        if (job.clientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Job removed successfully' });
    } catch (error) {
        console.error('Delete job error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get jobs by client (my jobs)
// @route   GET /api/jobs/my-jobs
// @access  Private (Client)
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ clientId: req.user._id })
            .populate('hiredFreelancer', 'name email profileImage')
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        console.error('Get my jobs error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Mark job as completed
// @route   PUT /api/jobs/:id/complete
// @access  Private (Client)
const completeJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.clientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        job.status = 'completed';
        await job.save();

        res.json(job);
    } catch (error) {
        console.error('Complete job error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob, getMyJobs, completeJob };
