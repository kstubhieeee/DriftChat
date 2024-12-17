// api/server.js
const express = require("express");
const app = express();
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

// Middleware
app.use(bodyParser.json());

// Example Route
app.get("/", (req, res) => {
  res.send("Hello from Vercel serverless function!");
});

// Socket.io Integration
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (msg) => {
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

module.exports = serverless(app);
