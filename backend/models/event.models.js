const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    registerId: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        reuired: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Register', registerSchema);