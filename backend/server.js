const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Socket.io setup for real-time chat
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

const mongoose = require('mongoose');

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'Server is running',
        dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

// Socket.io connection handling
const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins with their user ID
    socket.on('join', (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} is online`);
    });

    // Handle sending messages in real time
    socket.on('sendMessage', (data) => {
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receiveMessage', data);
        }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('userTyping', data);
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        // Remove user from online users
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
