import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
  cors: true,
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}
const users = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId)  userSocketMap[userId] = socket.id;

  const peerId = socket.handshake.query.peerId;


  if (peerId) users[userId] = peerId ;


  // Sending the list of online users

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  
  // Sending the list of peer ids
  io.emit('getPeerIds', users);
  
  console.log("Peers:", Object.values(users));

  socket.on('register', (peerId) => {
    users[socket.id] = { peerId };
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };