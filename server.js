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
  socket.on('subscribe', (room) => {
    console.log(`Entrou na sala ${room}`);
    socket.join(room);
  });
});

app.post('/message/send', (req, res) => {
  const { receiverId, senderId, message } = req.body;

    console.log(`Enviando mensagem para o usuário: ${receiverId}`);

    io.to(`app_chat_user_${receiverId}`).emit('newMessage', {
      friend_id: senderId,
      message: message,
      groupId: null,
    });

  res.status(200).send('success');
});

server.listen(7000, () => {
  console.log('Servidor rodando na porta 7000');
});
