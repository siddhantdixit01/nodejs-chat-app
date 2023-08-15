const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {}; 

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('user joined', (userName) => {
    users[socket.id] = userName;
    io.emit('chat message', {
      user: 'System',
      text: `${userName} joined the chat`,
    });
  });

  socket.on('chat message', (message) => {
    io.emit('chat message', {
      user: users[socket.id] || 'Anonymous',
      text: message,
    });
  });

  socket.on('disconnect', () => {
    const userName = users[socket.id];
    delete users[socket.id];
    io.emit('chat message', {
      user: 'System',
      text: `${userName} left the chat`,
    });
    console.log('A user disconnected');
  });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
