const express = require('express');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// ── Register ──────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'Please fill all fields'
            });
        }

        const cleanUsername = username.trim().replace(/\s+/g, '_');

        // Check if exists
        const exists = await User.findOne({
            $or: [
                { email:    email.toLowerCase() },
                { username: cleanUsername }
            ]
        });

        if (exists) {
            return res.status(400).json({
                message: 'Username or email already taken'
            });
        }

        // Hash password manually
        const salt           = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            username: cleanUsername,
            email:    email.toLowerCase(),
            password: hashedPassword,
        });

        console.log('✅ Registered:', user.username);

        return res.status(201).json({
            _id:      user._id,
            username: user.username,
            email:    user.email,
            token:    generateToken(user._id),
        });

    } catch (error) {
        console.log('❌ Register error:', error.message);
        return res.status(500).json({
            message: error.message
        });
    }
});

// ── Login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Please fill all fields'
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Update status
        await User.findByIdAndUpdate(user._id, {
            status: 'online'
        });

        console.log('✅ Login:', user.username);

        return res.json({
            _id:      user._id,
            username: user.username,
            email:    user.email,
            status:   'online',
            token:    generateToken(user._id),
        });

    } catch (error) {
        console.log('❌ Login error:', error.message);
        return res.status(500).json({
            message: error.message
        });
    }
});

// ── Get current user ──────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
    try {
        return res.json(req.user);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// ── Logout ────────────────────────────────────────────────────
router.post('/logout', protect, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            status:   'offline',
            lastSeen: Date.now(),
        });
        return res.json({ message: 'Logged out' });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;