import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { listenToEvents } from './services/solanaListener';
import { startAiHeartbeat } from './services/aiHeartbeat';
import { getHistory } from './services/biddingHistory';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('AI Off-chain Notification Service is running!');
});

app.get('/history', (req, res) => {
  const history = getHistory();
  res.json(history);
});

io.on('connection', (socket) => {
  console.log('A user connected with socket id:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  listenToEvents(io);
  startAiHeartbeat(io);
});
