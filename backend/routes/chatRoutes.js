const express = require('express');
const router = express.Router();
const { sendMessage, getConversation, getConversations } = require('../controllers/chatController');
const { protect } = require('../middlewares/auth');

// All chat routes require authentication
router.use(protect);

// @route   GET /api/chat - Get all conversations
router.get('/', getConversations);

// @route   GET /api/chat/:userId - Get conversation with a specific user
router.get('/:userId', getConversation);

// @route   POST /api/chat - Send a message
router.post('/', sendMessage);

module.exports = router;
