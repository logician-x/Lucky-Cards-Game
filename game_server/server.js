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
  BETTING: 'betting',  // Main timer: 30-9s (Phase timer: 20-1s)
  RESULT: 'result',    // Main timer: 8-4s (Phase timer: 5-1s)
  RESET: 'reset'       // Main timer: 3-1s (Phase timer: 3-1s)
};

// Game configuration
const GAME_CONFIG = {
  ROUND_DURATION: 30,
  BETTING_DURATION: 20, // Show 20s for betting phase
  RESULT_DURATION: 5,
  RESET_DURATION: 3
};

// Game state with high precision timing
let gameState = {
  timer: GAME_CONFIG.ROUND_DURATION,
  phaseTimer: GAME_CONFIG.BETTING_DURATION,
  phase: PHASES.BETTING,
  interval: null,
  startTime: null,
  lastBroadcast: 0
};

// Calculate phase timer based on main timer and phase
function calculatePhaseTimer(mainTimer, phase) {
  switch (phase) {
    case PHASES.BETTING:
      // Main timer 30-9: Phase timer 20-1
      if (mainTimer >= 9 && mainTimer <= 30) {
        return Math.max(1, mainTimer - 8);
      }
      return GAME_CONFIG.BETTING_DURATION;
      
    case PHASES.RESULT:
      // Main timer 8-4: Phase timer 5-1
      if (mainTimer >= 4 && mainTimer <= 8) {
        return Math.max(1, mainTimer - 3);
      }
      return GAME_CONFIG.RESULT_DURATION;
      
    case PHASES.RESET:
      // Main timer 3-1: Phase timer 3-1
      if (mainTimer >= 1 && mainTimer <= 3) {
        return Math.max(1, mainTimer);
      }
      return GAME_CONFIG.RESET_DURATION;
      
    default:
      return 1;
  }
}

// Determine phase based on main timer
function getPhaseFromTimer(timer) {
  if (timer > 8) {
    return PHASES.BETTING;
  } else if (timer > 3) {
    return PHASES.RESULT;
  } else {
    return PHASES.RESET;
  }
}

// Start the game timer with high precision
function startGameTimer() {
  // Clear any existing interval
  if (gameState.interval) {
    clearInterval(gameState.interval);
  }

  // Initialize game state
  gameState.timer = GAME_CONFIG.ROUND_DURATION;
  gameState.phase = PHASES.BETTING;
  gameState.phaseTimer = GAME_CONFIG.BETTING_DURATION;
  gameState.startTime = Date.now();
  gameState.lastBroadcast = 0;

  console.log('Game timer started');
  
  // Broadcast initial state
  broadcastGameState();

  // Use high frequency updates for smooth timing
  gameState.interval = setInterval(() => {
    updateGameState();
  }, 100); // Update every 100ms for smoother timing
}

// Update game state with precise timing
function updateGameState() {
  const now = Date.now();
  const elapsed = (now - gameState.startTime) / 1000;
  
  // Calculate precise timer value
  const newTimer = Math.max(0, GAME_CONFIG.ROUND_DURATION - elapsed);
  
  // Update timer
  gameState.timer = newTimer;
  
  // Determine phase
  const newPhase = getPhaseFromTimer(newTimer);
  const phaseChanged = newPhase !== gameState.phase;
  gameState.phase = newPhase;
  
  // Calculate phase timer
  gameState.phaseTimer = calculatePhaseTimer(newTimer, newPhase);
  
  // Reset cycle when timer reaches 0
  if (newTimer <= 0) {
    console.log('Round completed, starting new round');
    gameState.startTime = now;
    gameState.timer = GAME_CONFIG.ROUND_DURATION;
    gameState.phase = PHASES.BETTING;
    gameState.phaseTimer = GAME_CONFIG.BETTING_DURATION;
  }
  
  // Broadcast updates (throttled to avoid spam)
  const shouldBroadcast = 
    phaseChanged || 
    (now - gameState.lastBroadcast) >= 200 || // Every 200ms minimum
    Math.floor(gameState.timer) !== Math.floor(gameState.timer + 0.1); // Timer second changed
    
  if (shouldBroadcast) {
    broadcastGameState();
    gameState.lastBroadcast = now;
  }
}

// Broadcast game state to all connected clients
function broadcastGameState() {
  const stateToSend = {
    timer: parseFloat(gameState.timer.toFixed(2)), // Send with 2 decimal precision
    phaseTimer: Math.max(1, Math.ceil(gameState.phaseTimer)), // Always at least 1
    phase: gameState.phase,
    timestamp: Date.now() // Help client sync
  };
  
  io.emit('timerUpdate', stateToSend);
  
  // Log phase transitions
  if (gameState.phase !== gameState.lastLoggedPhase) {
    console.log(`Phase changed to: ${gameState.phase}, Timer: ${gameState.timer.toFixed(1)}s, PhaseTimer: ${stateToSend.phaseTimer}s`);
    gameState.lastLoggedPhase = gameState.phase;
  }
}

// Track connected clients
let connectedClients = 0;

// Socket.io event handlers
io.on('connection', (socket) => {
  connectedClients++;
  console.log(`Client connected: ${socket.id}. Total clients: ${connectedClients}`);
  
  // Send current game state to newly connected user
  const currentState = {
    timer: parseFloat(gameState.timer.toFixed(2)),
    phaseTimer: Math.max(1, Math.ceil(gameState.phaseTimer)),
    phase: gameState.phase,
    timestamp: Date.now()
  };
  
  socket.emit('timerUpdate', currentState);
  
  // Handle client disconnection
  socket.on('disconnect', () => {
    connectedClients--;
    console.log(`Client disconnected: ${socket.id}. Total clients: ${connectedClients}`);
  });
  
  // Handle client ping for latency measurement
  socket.on('ping', (callback) => {
    if (callback) callback();
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Game server running on port ${PORT}`);
  console.log(`Game phases: BETTING(30-9s), RESULT(8-4s), RESET(3-1s)`);
  console.log(`Phase timers: BETTING(20-1s), RESULT(5-1s), RESET(3-1s)`);
  
  // Start the game timer when server starts
  startGameTimer();
});

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    clients: connectedClients,
    gamePhase: gameState.phase,
    timer: parseFloat(gameState.timer.toFixed(2)),
    phaseTimer: Math.max(1, Math.ceil(gameState.phaseTimer)),
    uptime: process.uptime()
  });
});

// Add debug endpoint
app.get('/debug', (req, res) => {
  res.status(200).json({
    gameState: {
      timer: gameState.timer,
      phaseTimer: gameState.phaseTimer,
      phase: gameState.phase,
      startTime: gameState.startTime,
      elapsed: (Date.now() - gameState.startTime) / 1000
    },
    config: GAME_CONFIG,
    clients: connectedClients
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

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});