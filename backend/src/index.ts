import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

interface Message {
  id: string;
  author:string
  message: string;
  upvotes: number;
  roomId: string;
  answered: Boolean
}
interface Room {
  socketId: string;
  username: string;
  normalLimit:number,
  importantLimit:number,
  mILimit:number,
  slowMode:number,
}
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

let messages: Message[] = [];
const rooms: { [key: string]: Room } = {};
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);


  socket.emit('initialMessages', messages);


  socket.on('createRoom', ({  roomId, username,normalLimit,importantLimit,mILimit,slowMode }: any) => {
    if (rooms[roomId]) {

      socket.emit('roomExists', { roomId });
      console.log("room exists")

    } else {

      const creatorSocketId = socket.id;
      rooms[roomId] = { socketId: creatorSocketId, username ,normalLimit,importantLimit,mILimit,slowMode };
      socket.join(roomId);
      console.log(`Room created: ${roomId} by user ${username} with ${normalLimit} || ${importantLimit} || ${mILimit} || delay - ${slowMode}`);


      io.to(roomId).emit('roomCreated', { username, creatorSocketId,normalLimit,importantLimit,mILimit,slowMode });
    }
  });
  socket.on('joinRoom', ({ joinroomId, joinusername }) => {
    const roomData = rooms[joinroomId];
    if (roomData) {
      const { normalLimit, importantLimit, mILimit,slowMode } = roomData;
      socket.join(joinroomId);
      socket.emit('roomLimits', { normalLimit, importantLimit, mILimit,slowMode });
      console.log(`User ${joinusername} joined room: ${joinroomId} ----- ${slowMode}`);
    } else {
      socket.emit('roomDoesNotExists', { joinroomId });

      console.log(`Room ${joinroomId} does not exist`);
    }
  });

  socket.on('message', (message: Message) => {
    console.log(`Message received from ${socket.id}: ${message.roomId} `);
    const roomData = rooms[message.roomId];
    if (roomData) {
      const messageObject = { ...message, id: `${message.id}`, upvotes: 0,answered:false };
      messages.push(messageObject);

      if (messages.length > 10000) {
        messages.splice(0, 1);
      }

      io.to(message.roomId).emit('message', messageObject);
    } else {
      console.log(`Room ${message.roomId} does not exist`);
    }
  });

  socket.on('upvote', (id: string) => {
    const index = messages.findIndex((msg) => msg.id === id);
    if (index !== -1) {
      messages[index].upvotes++;
      io.emit('message', messages[index]);
    }
  });
  socket.on('answered', (id: string) => {
    const index = messages.findIndex((msg) => msg.id === id);
    if (index !== -1) {
      messages[index].answered=true;
      console.log(`${id} is answered`)
      io.emit('message', messages[index]);
    }
  });
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    for (const room in rooms) {
      if (rooms[room].socketId === socket.id) {
        delete rooms[room];
        console.log(`Room ${room} deleted`);
      }
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
