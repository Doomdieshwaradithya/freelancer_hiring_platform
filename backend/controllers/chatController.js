const Chat = require('../models/Chat');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;

        if (!receiverId || !message) {
            return res.status(400).json({ message: 'Receiver and message are required' });
        }

        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        const chat = await Chat.create({
            senderId: req.user._id,
            receiverId,
            message
        });

        // Populate sender info before sending response
        const populatedChat = await Chat.findById(chat._id)
            .populate('senderId', 'name profileImage')
            .populate('receiverId', 'name profileImage');

        res.status(201).json(populatedChat);
    } catch (error) {
        console.error('Send message error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get conversation between two users
// @route   GET /api/chat/:userId
// @access  Private
const getConversation = async (req, res) => {
    try {
        const otherUserId = req.params.userId;

        // Get all messages between the two users
        const messages = await Chat.find({
            $or: [
                { senderId: req.user._id, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: req.user._id }
            ]
        })
            .populate('senderId', 'name profileImage')
            .populate('receiverId', 'name profileImage')
            .sort({ createdAt: 1 });

        // Mark messages as read
        await Chat.updateMany(
            { senderId: otherUserId, receiverId: req.user._id, read: false },
            { read: true }
        );

        res.json(messages);
    } catch (error) {
        console.error('Get conversation error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get list of conversations (chat contacts)
// @route   GET /api/chat
// @access  Private
const getConversations = async (req, res) => {
    try {
        // Find all unique users this person has chatted with
        const sentMessages = await Chat.find({ senderId: req.user._id }).distinct('receiverId');
        const receivedMessages = await Chat.find({ receiverId: req.user._id }).distinct('senderId');

        // Combine and remove duplicates
        const allUserIds = [...new Set([...sentMessages, ...receivedMessages].map(id => id.toString()))];

        // Get user details for each contact
        const contacts = await User.find({ _id: { $in: allUserIds } }).select('name email profileImage role');

        // For each contact, get the last message and unread count
        const conversationList = await Promise.all(
            contacts.map(async (contact) => {
                const lastMessage = await Chat.findOne({
                    $or: [
                        { senderId: req.user._id, receiverId: contact._id },
                        { senderId: contact._id, receiverId: req.user._id }
                    ]
                }).sort({ createdAt: -1 });

                const unreadCount = await Chat.countDocuments({
                    senderId: contact._id,
                    receiverId: req.user._id,
                    read: false
                });

                return {
                    user: contact,
                    lastMessage: lastMessage,
                    unreadCount
                };
            })
        );

        // Sort by last message time
        conversationList.sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        });

        res.json(conversationList);
    } catch (error) {
        console.error('Get conversations error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { sendMessage, getConversation, getConversations };
