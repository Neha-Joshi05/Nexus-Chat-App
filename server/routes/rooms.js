const express = require('express');
const Room    = require('../models/Room');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all rooms
router.get('/', protect, async (req, res) => {
    try {
        const rooms = await Room.find({ isPrivate: false })
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create room
router.post('/', protect, async (req, res) => {
    try {
        const { name, description } = req.body;

        const roomExists = await Room.findOne({ name });
        if (roomExists) {
            return res.status(400).json({
                message: 'Room already exists'
            });
        }

        const room = await Room.create({
            name,
            description,
            createdBy: req.user._id,
            members:   [req.user._id],
        });

        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Seed default rooms
router.post('/seed', async (req, res) => {
    try {
        const defaults = [
            { name: 'general',    description: 'General chat' },
            { name: 'tech',       description: 'Tech discussions' },
            { name: 'random',     description: 'Random talks' },
            { name: 'announcements', description: 'Updates' },
        ];

        for (const room of defaults) {
            await Room.findOneAndUpdate(
                { name: room.name },
                room,
                { upsert: true }
            );
        }
        res.json({ message: 'Default rooms created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;