const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: '*' } });

let timer = 30;
let phase = 'BETTING';
let interval = null;
let currentBets = {}; // { userId: [{ option: 2, amount: 100 }, ...] }

const itemNames = [
  'Umbrella', 'Football', 'Sun', 'Diya', 'Cow', 'Bucket',
  'Kite', 'Top', 'Rose', 'Butterfly', 'Crow', 'Rabbit'
];

function startGameLoop() {
  timer = 30;
  phase = 'BETTING';
  currentBets = {};
  io.emit('gameState', { timer, phase });

  interval = setInterval(() => {
    timer--;

    // Phase transitions
    if (timer === 8 && phase !== 'result') {
      phase = 'RESULT';
      io.emit('gameState', { timer, phase });
      determineWinner();
    } else if (timer === 3 && phase !== 'reset') {
      phase = 'RESET';
      io.emit('gameState', { timer, phase });
    } else if (timer === 0) {
      startGameLoop(); // restart
    } else {
      io.emit('timerUpdate', timer);
    }
  }, 1000);
}

function determineWinner() {
  const winnerIndex = Math.floor(Math.random() * 12);
  const winnerName = itemNames[winnerIndex];
  
  // Simulate calculating winnings
  const winners = [];
  for (const userId in currentBets) {
    const bets = currentBets[userId];
    const wonBets = bets.filter(b => b.option === winnerIndex);
    const totalWin = wonBets.reduce((sum, b) => sum + b.amount * 10, 0); // 10x multiplier
    if (totalWin > 0) {
      winners.push({ userId, totalWin });
    }
  }

  io.emit('winnerAnnouncement', { winnerIndex, winnerName, winners });
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.emit('gameState', { timer, phase });

  socket.on('placeBet', ({ userId, option, amount }) => {
    if (!currentBets[userId]) currentBets[userId] = [];
    currentBets[userId].push({ option, amount });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

startGameLoop();
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
