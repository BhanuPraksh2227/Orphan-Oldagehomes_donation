const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        
        // Validate input
        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({ 
                message: 'All fields are required' 
            });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ 
                message: 'User already exists with this email' 
            });
        }

        // Create new user
        user = new User({
            name,
            email,
            password,
            phone,
            address
        });

        await user.save();

        res.status(201).json({ 
            success: true,
            message: 'Registration successful' 
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ 
            message: 'An error occurred during registration' 
        });
    }
};

exports.loginUser = async (req, res) => {
    console.log('Login attempt with:', req.body); // Debug log

    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        console.log('User found:', user ? 'Yes' : 'No'); // Debug log

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isValidPassword ? 'Yes' : 'No'); // Debug log

        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '24h' }
        );

        // Send response
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};