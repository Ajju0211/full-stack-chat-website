import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";



import { connectDB } from './libs/db.js';

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { io, app, server } from "./libs/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();


app.use(express.json({ limit: '50mb' }));  // Set a higher limit for large payloads
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://your-front-end-domain.com"], // Add more origins as needed
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../front-end/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
  connectDB();
});
