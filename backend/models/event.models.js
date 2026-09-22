const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    registerId: {
    type: Int32,
    primaryKey: true,
    autoIncrement: true,
  },
    name: {
        type: String,
        required: true,
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

module.exports = mongoose.model('Registration', registerSchema);