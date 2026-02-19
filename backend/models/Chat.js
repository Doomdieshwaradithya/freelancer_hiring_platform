const mongoose = require('mongoose');

// Chat Schema - messages between users
const chatSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: [true, 'Message cannot be empty']
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true   // timestamp field created automatically
});

module.exports = mongoose.model('Chat', chatSchema);
