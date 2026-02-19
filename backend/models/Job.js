const mongoose = require('mongoose');

// Job Schema - jobs posted by clients
const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a job description']
    },
    budget: {
        type: Number,
        required: [true, 'Please add a budget']
    },
    skillsRequired: {
        type: [String],
        required: [true, 'Please add required skills']
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed'],
        default: 'open'
    },
    hiredFreelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    category: {
        type: String,
        default: 'General'
    },
    duration: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
