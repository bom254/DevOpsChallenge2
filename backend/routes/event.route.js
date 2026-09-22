const express = require('express');
const router = express.Router();
const Registration = require('../models/event.models');

router.post('/', async (req, res) => {
  try {
    const registerData = req.body;

    if (!registerData.name || !registerData.name.trim()) {
      return res.status(400).json({ message: 'Full Name is required' });
    }

    if (!registerData.email || !registerData.email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }

    registerData.email = registerData.email.toLowerCase().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const existingEmail = await Registration.findOne({ email: registerData.email });
    if (existingEmail) {
      return res.status(400).json({ message: 'This email already exists' });
    }

    const register = new Registration(registerData);
    await register.save();

    return res.status(201).json({
      message: 'Registration successful',
      data: register
    });
  } catch (error) {
    console.error('Error registering:', error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;