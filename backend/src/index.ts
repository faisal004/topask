const express = require('express');
const { createServer } = require('node:http');
const cors = require("cors")
const app = express();
const { Server } = require("socket.io")
const server = createServer(app);
app.use(cors())

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
})

io.on("connection", (socket: any) => {
  console.log(`user connected ${socket.id}`)
  socket.on("join_room", (data: any) => {
    socket.join(data)
    console.log(`User with ID ${socket.id} joined the room ${data}`)
  })
  socket.on("send_message", (data: any) => {
    socket.to(data.room).emit("receive_message",data)
    console.log(data)
  })
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id)
  })
})


server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});