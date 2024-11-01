const express = require('express');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('subscribe', (room) => {
    console.log(`Entrou na sala ${room}`);
    socket.join(room);
  });

  socket.on('sendMessage', (msg) => {
    io.to(`app_chat_user_${msg.receiver_id}`).emit('newMessage', {
      friend_id: msg.friend_id,
      message: msg.message
    });

    app.post('/message/send', (req, res) => {
      res.status(200).send('success');
    });
  });
});

server.listen(7000, () => {
  console.log('Servidor rodando na porta 7000');
});
