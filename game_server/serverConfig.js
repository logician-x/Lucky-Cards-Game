// Server connection configuration
export const SERVER_CONFIG = {
  // Base URL for your local game server
  BASE_URL: 'http://192.168.34.145:3001',
  
  // Shorter timeout for local connections (milliseconds)
  CONNECTION_TIMEOUT: 3000,
  
  // Enable local fallback for smoother experience
  USE_LOCAL_FALLBACK: true,
  
  // Socket.io connection options optimized for local servers
  SOCKET_OPTIONS: {
    transports: ['websocket'],   // WebSocket only for local connections - faster
    reconnection: true,          
    reconnectionAttempts: 10,    // More attempts for local server
    reconnectionDelay: 500,      // Shorter delay for local reconnection attempts
    timeout: 5000,               // Shorter connection timeout
    forceNew: true,              // Force new connection each time
    
    // Additional local connection optimizations
    upgrade: true,               // Enable transport upgrades
    rememberUpgrade: true,       // Remember the transport used
    autoConnect: true            // Connect automatically
  }
};

// Game-specific constants
export const GAME_CONFIG = {
  // Total round duration (seconds)
  ROUND_DURATION: 30,
  
  // Phase durations (seconds)
  BETTING_DURATION: 22,
  RESULT_DURATION: 5,
  RESET_DURATION: 3,
  
  // Local performance settings
  TIMER_THROTTLE: 16.67,         // ~60fps for smooth animation updates
  SERVER_UPDATE_THROTTLE: 100    // Limit processing server updates (ms)
};