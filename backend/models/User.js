const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema - represents both Client and Freelancer
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false   // Don't return password in queries by default
    },
    role: {
        type: String,
        enum: ['client', 'freelancer'],
        required: [true, 'Please select a role']
    },
    profileImage: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: '',
        maxlength: 500
    },
    skills: {
        type: [String],
        default: []
    },
    hourlyRate: {
        type: Number,
        default: 0
    },
    experience: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    }
}, {
    timestamps: true   // Adds createdAt and updatedAt fields automatically
});

// Hash password before saving to database
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
