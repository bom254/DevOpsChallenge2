const express = require('express');
const router = express.Router();

// Register for an event
router.post('/', async (req, res) => {
    try {
        const registerData = req.body;

        // Validate required fields
        if(!registerData.fullName || !registerData.fullName.trim()) {
            return res.status(400).json({message: 'Full Name is required'});
        }
        if(!registerData.email || !registerData.email.trim()) {
            return res.status(400).json({message: 'Email is required'});
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registerData.email)) {
            return res.status(400).json({message: 'Please provide a valid email address'});
        }

        // Check if the email exits
        const existingEmail = await registerData.findOne({email: registerData.email.toLowerCase()});
        if (existingEmail) {
            return res.status(400).json({message: 'This email already exists'});
        }

        const register = new Register(registerData);
        await register.save();

        const populateRegister = await Register.findById(register._id)
            .populate('fullName', 'email');
        
        res.status(201).json({message:'Resgitration successful'},populateRegister);
    } catch (error) {
        console.error('Error registering:', error);

        // Handle validation errors
        if(error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({message: messages.join(', ')});
        }

        // Handle duplicate keys
        if(error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({message: `${field} already exists`});
        }

        res.status(400).json({message: error.message});
    }
});

module.exports = router;