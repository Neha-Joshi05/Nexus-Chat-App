const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router  = express.Router();

// Get messages for a room
router.get('/room/:roomId', protect, async (req, res) => {
    try {
        const messages = await Message.find({
            room:      req.params.roomId,
            isDeleted: false,
        })
        .populate('sender', 'username avatar status')
        .sort({ createdAt: 1 })
        .limit(100);

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get private messages
router.get('/private/:userId', protect, async (req, res) => {
    try {
        const messages = await Message.find({
            type: 'private',
            $or: [
                { sender:   req.user._id,
                  receiver: req.params.userId },
                { sender:   req.params.userId,
                  receiver: req.user._id },
            ],
            isDeleted: false,
        })
        .populate('sender',   'username avatar')
        .populate('receiver', 'username avatar')
        .sort({ createdAt: 1 })
        .limit(100);

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete message
router.delete('/:id', protect, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                message: 'Message not found'
            });
        }

        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: 'Not authorized'
            });
        }

        message.isDeleted = true;
        await message.save();

        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;