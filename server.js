const { log } = require("console");
const express = require("express");
const app = express();
const http = require("http").createServer(app);

const port = process.env.port || 3000;

app.use(express.static(__dirname + "/public"));

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("Connected.....");

  socket.on("message", (msg) => {
    // console.log(msg);

    socket.broadcast.emit("message", msg);
  });
});
