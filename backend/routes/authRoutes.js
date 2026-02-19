const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

// @route   POST /api/auth/register
// Validation rules for registration
router.post('/register', [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('role', 'Role must be client or freelancer').isIn(['client', 'freelancer'])
], registerUser);

// @route   POST /api/auth/login
router.post('/login', [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').notEmpty()
], loginUser);

// @route   GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;
