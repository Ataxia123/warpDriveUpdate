const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const activeUsers = new Set();
const chatHistory = [];

// Socket.IO with CORS for frontend origin
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001", // Allow your frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Use socket ID as a unique identifier for each user
  const userSocketId = socket.id;
  activeUsers.add(userSocketId);

  // Emit the number of active users
  io.emit('user count', activeUsers.size);

  // Send the chat history to the newly connected client
  socket.emit('chat history', chatHistory);

  socket.on('send message', (msg) => {
    chatHistory.push(msg); // Add the message to the chat history
    io.emit('receive message', msg); // Broadcast the message to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    activeUsers.delete(userSocketId);
    // Emit the updated count
    io.emit('user count', activeUsers.size);
  });
});

// Express CORS middleware (optional if only using Socket.IO)
app.use(cors({
  origin: 'http://localhost:3001', // Allow your frontend URL
  methods: ['GET', 'POST'] // Allowable methods
}));

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
