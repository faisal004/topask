const express = require('express');
const { createServer } = require('node:http');
const cors= require("cors")
const app = express();
const {Server} = require("socket.io")
const server = createServer(app);
app.use(cors())

const io = new Server(server,{
  cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST"],
  }
})

io.on("connection",(socket:any)=>{
  console.log(socket.id)

  socket.on("disconnect",()=>{
    console.log("user disconnected",socket.id)
  })
})


server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});