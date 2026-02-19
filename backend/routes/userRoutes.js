const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile, getFreelancers } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// @route   GET /api/users/freelancers - Get all freelancers (public)
router.get('/freelancers', getFreelancers);

// @route   GET /api/users/:id - Get user profile
router.get('/:id', protect, getUserProfile);

// @route   PUT /api/users/profile - Update own profile
router.put('/profile', protect, upload.single('profileImage'), updateProfile);

module.exports = router;
