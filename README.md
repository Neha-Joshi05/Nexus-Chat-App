# ⚡ NexusChat — Real-Time Chat Application

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-black?style=flat-square)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)

---

## 🌐 Live Demo
**Frontend** → https://nexus-chat-app-54x6.vercel.app
**Backend**  → https://nexus-chat-app-xgo4.onrender.com
---

## 📌 Overview
NexusChat is a full-stack real-time chat application built
with React, Node.js, Socket.IO and MongoDB.
Users can register, login, join channels and chat
with multiple users simultaneously in real time.

---

## ✨ Features
- 🔐 JWT Authentication (Register/Login/Logout)
- 💬 Real-time messaging with Socket.IO
- 📌 Multiple chat channels
- 👥 Online users list
- ⚡ Typing indicators
- 📜 Chat history from MongoDB
- ➕ Create custom channels
- 🌙 Cyberpunk dark UI design
- 📱 Responsive layout
- 🚀 Fully deployed and live

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React.js | UI framework |
| Socket.IO Client | Real-time connection |
| Axios | API calls |
| React Router | Navigation |
| CSS-in-JS | Styling |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| Socket.IO | Real-time engine |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Database hosting |

---

## 📁 Folder Structure
```
Nexus-Chat-App/
│
├── client/ # React frontend
│ ├── src/
│ │ ├── context/ # Auth, Socket, Chat context
│ │ ├── pages/ # Login, Register, Chat
│ │ ├── utils/ # API utilities
│ │ └── App.js
│ └── package.json
│
└── server/ # Node.js backend
├── config/ # Database connection
├── middleware/ # JWT middleware
├── models/ # User, Message, Room
├── routes/ # Auth, Messages, Rooms
├── index.js # Server entry point
└── package.json
```
---

## ⚙️ Installation

```bash
# 1. Clone the repo
git clone https://github.com/Neha-Joshi05/Nexus-Chat-App.git
cd Nexus-Chat-App

# 2. Setup backend
cd server
npm install
# Create .env file with:
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_secret
# CLIENT_URL=http://localhost:3000
# PORT=5000
npm run dev

# 3. Setup frontend
cd ../client
npm install
# Create .env file with:
# REACT_APP_API_URL=http://localhost:5000
# REACT_APP_SOCKET_URL=http://localhost:5000
npm start
```

---

## 🧠 How It Works
```
User registers/logs in
↓
JWT token generated
↓
Socket.IO connection established
↓
User joins a channel
↓
Messages sent → Server broadcasts → All users receive
↓
Messages saved to MongoDB
```
---

## 🔌 API Endpoints
```
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/logout | Logout user |
| GET | /api/rooms | Get all rooms |
| POST | /api/rooms | Create room |
| GET | /api/messages/room/:id | Get room messages |
```
---

## ⚡ Socket Events
```
| Event | Description |
|-------|-------------|
| joinRoom | Join a chat channel |
| sendMessage | Send a message |
| newMessage | Receive a message |
| typing | User is typing |
| stopTyping | User stopped typing |
| onlineUsers | Get online users list |
```
---

## 🎯 Interview Topics
```
- Full stack architecture
- JWT authentication flow
- WebSocket vs HTTP
- Socket.IO rooms and broadcasting
- MongoDB schema design
- React Context API
- REST API design
- Cloud deployment
```
---

## 👤 Author
**Neha Joshi**
- GitHub: https://github.com/Neha-Joshi05/Nexus-Chat-App
- LinkedIn: https://www.linkedin.com/in/neha-joshi-0851a2322?utm_source=share_via&utm_content=profile&utm_medium=member_android

---

## ⭐ Star this repo if you found it helpful!
