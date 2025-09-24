import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { generateNotification, NotificationType } from './services/aiNotifier';
import { listenToEvents } from './services/solanaListener';

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

// API Endpoint for Testing
app.get('/trigger-notifications', (req, res) => {
  console.log('--- Manually Triggering Notifications via API ---');

  const notifications = [
    { type: 'success', message: generateNotification(NotificationType.Start, {}) },
    { type: 'info', message: generateNotification(NotificationType.MidDay, {}) },
    { type: 'warning', message: generateNotification(NotificationType.End, {}) },
  ];

  notifications.forEach(notification => {
    io.emit('new_notification', notification); // Emit event to all connected clients
    console.log(`Emitted: ${notification.message}`);
  });
  
  console.log('------------------------------------');
  res.send('Test notifications emitted via WebSocket!');
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
});
