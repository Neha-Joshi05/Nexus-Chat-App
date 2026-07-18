const express   = require('express');
const http      = require('http');
const socketio  = require('socket.io');
const mongoose  = require('mongoose');
const cors      = require('cors');
require('dotenv').config();

const connectDB  = require('./config/db');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const msgRoutes  = require('./routes/messages');
const Message    = require('./models/Message');
const User       = require('./models/User');
const jwt        = require('jsonwebtoken');

// ── App setup ─────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);
const io     = socketio(server, {
    cors: {
        origin:  process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
    }
});

// ── Connect DB ────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000'
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/rooms',    roomRoutes);
app.use('/api/messages', msgRoutes);

app.get('/', (req, res) => {
    res.json({
        message: '⚡ Nexus Chat API is running!',
        status:  'online',
    });
});

// ── Online users map ──────────────────────────────────────────
const onlineUsers = new Map();

// ── Socket.IO ─────────────────────────────────────────────────
io.use(function(socket, next) {
    var token = socket.handshake.auth.token;
    if (!token) {
        socket.userId = null;
        next();
        return;
    }
    try {
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
        return;
    } catch(e) {
        socket.userId = null;
        next();
        return;
    }
});

io.on('connection', async (socket) => {
    console.log(`  🟢 User connected: ${socket.userId}`);

    // Update user status to online
    try {
        const user = await User.findByIdAndUpdate(
            socket.userId,
            { status: 'online' },
            { new: true }
        ).select('-password');

        onlineUsers.set(socket.userId, {
            socketId: socket.id,
            username: user.username,
            status:   'online',
        });

        // Broadcast online users
        io.emit('onlineUsers', Array.from(onlineUsers.values()));
        socket.emit('connected', { user });

    } catch (err) {
        console.log('Connection error:', err.message);
    }

    // ── Join room ─────────────────────────────────────────────
    socket.on('joinRoom', async ({ roomId }) => {
        socket.join(roomId);
        console.log(`  📌 User ${socket.userId} joined room ${roomId}`);

        // Send last 50 messages
        try {
            const messages = await Message.find({
                room: roomId, isDeleted: false
            })
            .populate('sender', 'username avatar status')
            .sort({ createdAt: -1 })
            .limit(50);

            socket.emit('messageHistory',
                messages.reverse()
            );
        } catch (err) {
            console.log('Join room error:', err.message);
        }
    });

    // ── Leave room ────────────────────────────────────────────
    socket.on('leaveRoom', ({ roomId }) => {
        socket.leave(roomId);
    });

    // ── Send message ──────────────────────────────────────────
    socket.on('sendMessage', async ({ content, roomId }) => {
        try {
            const message = await Message.create({
                content,
                sender: socket.userId,
                room:   roomId,
                type:   'public',
            });

            const populated = await message.populate(
                'sender', 'username avatar status'
            );

            io.to(roomId).emit('newMessage', populated);

        } catch (err) {
            socket.emit('error', { message: err.message });
        }
    });

    // ── Private message ───────────────────────────────────────
    socket.on('privateMessage', async ({ content, receiverId }) => {
        try {
            const message = await Message.create({
                content,
                sender:   socket.userId,
                receiver: receiverId,
                type:     'private',
            });

            const populated = await message.populate([
                { path: 'sender',   select: 'username avatar' },
                { path: 'receiver', select: 'username avatar' },
            ]);

            // Send to receiver if online
            const receiver = onlineUsers.get(receiverId);
            if (receiver) {
                io.to(receiver.socketId).emit(
                    'privateMessage', populated
                );
            }
            // Send back to sender
            socket.emit('privateMessage', populated);

        } catch (err) {
            socket.emit('error', { message: err.message });
        }
    });

    // ── Typing indicator ──────────────────────────────────────
    socket.on('typing', ({ roomId, username }) => {
        socket.to(roomId).emit('typing', { username });
    });

    socket.on('stopTyping', ({ roomId }) => {
        socket.to(roomId).emit('stopTyping');
    });

    // ── Disconnect ────────────────────────────────────────────
    socket.on('disconnect', async () => {
        console.log(`  🔴 User disconnected: ${socket.userId}`);

        onlineUsers.delete(socket.userId);

        try {
            await User.findByIdAndUpdate(socket.userId, {
                status:   'offline',
                lastSeen: Date.now(),
            });
        } catch (err) {
            console.log('Disconnect error:', err.message);
        }

        io.emit('onlineUsers', Array.from(onlineUsers.values()));
    });
});

// ── Start server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║   ⚡ NEXUS CHAT SERVER IS RUNNING!           ║');
    console.log(`║   Port    : ${PORT}                              ║`);
    console.log('║   Status  : Online                           ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});