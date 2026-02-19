const User = require('../models/User');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get user profile error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.phone = req.body.phone || user.phone;
        user.location = req.body.location || user.location;

        // Freelancer specific fields
        if (user.role === 'freelancer') {
            user.skills = req.body.skills || user.skills;
            user.hourlyRate = req.body.hourlyRate || user.hourlyRate;
            user.experience = req.body.experience || user.experience;
        }

        // Handle profile image upload
        if (req.file) {
            user.profileImage = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        console.error('Update profile error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all freelancers
// @route   GET /api/users/freelancers
// @access  Public
const getFreelancers = async (req, res) => {
    try {
        const { skill, minRate, maxRate, search } = req.query;

        // Build filter query
        let filter = { role: 'freelancer' };

        // Filter by skill
        if (skill) {
            filter.skills = { $in: [new RegExp(skill, 'i')] };
        }

        // Filter by hourly rate range
        if (minRate || maxRate) {
            filter.hourlyRate = {};
            if (minRate) filter.hourlyRate.$gte = Number(minRate);
            if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
        }

        // Search by name
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        const freelancers = await User.find(filter).sort({ createdAt: -1 });
        res.json(freelancers);
    } catch (error) {
        console.error('Get freelancers error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUserProfile, updateProfile, getFreelancers };
