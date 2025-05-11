const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);

// Configure Socket.io with appropriate CORS settings for React Native
const io = new Server(server, {
  cors: {
    origin: '*', // In production, specify your client URLs
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  },
  transports: ['websocket', 'polling'] // Explicitly supporting both for React Native
});

// Game phase constants - should match your client constants
const PHASES = {
  BETTING: 'betting',  // 0-22s
  RESULT: 'result',    // 22-27s
  RESET: 'reset'       // 27-30s
};

// Game state
let gameState = {
  timer: 30,
  phaseTimer: 22,
  phase: PHASES.BETTING,
  interval: null
};

// Start the game timer
function startGameTimer() {
  // Clear any existing interval
  if (gameState.interval) {
    clearInterval(gameState.interval);
  }

  // Reset timer
  gameState.timer = 30;
  gameState.phaseTimer = 22;
  gameState.phase = PHASES.BETTING;

  // Broadcast initial state
  broadcastGameState();

  // Start timer interval
  gameState.interval = setInterval(() => {
    // Decrement timer
    gameState.timer--;

    // Update phase and phase-specific timer
    if (gameState.timer > 8) {
      gameState.phase = PHASES.BETTING;
      gameState.phaseTimer = gameState.timer - 8;
    } else if (gameState.timer > 3) {
      gameState.phase = PHASES.RESULT;
      gameState.phaseTimer = gameState.timer - 3;
    } else {
      gameState.phase = PHASES.RESET;
      gameState.phaseTimer = gameState.timer;
    }

    // Broadcast updated state
    broadcastGameState();

    // Reset timer when it reaches 0
    if (gameState.timer <= 0) {
      gameState.timer = 30;
      gameState.phaseTimer = 22;
      gameState.phase = PHASES.BETTING;
      broadcastGameState();
    }
  }, 1000);
}

// Broadcast game state to all connected clients
function broadcastGameState() {
  io.emit('timerUpdate', {
    timer: gameState.timer,
    phaseTimer: gameState.phaseTimer,
    phase: gameState.phase
  });
}

// Track connected clients
let connectedClients = 0;

// Socket.io event handlers
io.on('connection', (socket) => {
  connectedClients++;
  console.log(`Client connected: ${socket.id}. Total clients: ${connectedClients}`);
  
  // Send current game state to newly connected user
  socket.emit('timerUpdate', {
    timer: gameState.timer,
    phaseTimer: gameState.phaseTimer,
    phase: gameState.phase
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    connectedClients--;
    console.log(`Client disconnected: ${socket.id}. Total clients: ${connectedClients}`);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Game server running on port ${PORT}`);
  
  // Start the game timer when server starts
  startGameTimer();
});

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    clients: connectedClients,
    gamePhase: gameState.phase,
    timer: gameState.timer
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down game server...');
  if (gameState.interval) {
    clearInterval(gameState.interval);
  }
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});