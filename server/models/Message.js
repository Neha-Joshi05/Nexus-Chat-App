const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type:     String,
        required: true,
        trim:     true,
    },
    sender: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'User',
        required: true,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  'Room',
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  'User',
    },
    type: {
        type:    String,
        enum:    ['public', 'private'],
        default: 'public',
    },
    isDeleted: {
        type:    Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);