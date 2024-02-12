import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

interface Message {
  id: string;
  message: string;
  upvotes: number;
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

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);


  socket.emit('initialMessages', messages);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  socket.on('message', (message: Message) => {
    console.log(`Message received from ${socket.id}: ${message.id}`);
    const messageObject = { ...message, id: `${message.id}`, upvotes: 0 };
    messages.push(messageObject);
    if (messages.length > 100) {

      messages.splice(0, 1);
    }
    io.emit('message', messageObject);
  });

  socket.on('upvote', (id: string) => {
    const index = messages.findIndex((msg) => msg.id === id);
    if (index !== -1) {
      messages[index].upvotes++;
      io.emit('message', messages[index]);
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
