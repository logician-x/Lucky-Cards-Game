import { useState, useEffect, useRef, useCallback } from 'react';
import { PHASES } from '../constants/gameConstants';
import io from 'socket.io-client';
import { SERVER_CONFIG, GAME_CONFIG } from '../game_server/serverConfig';

export default function useServerGameTimer(onPhaseChange, onDetermineWinner) {
  // Client-side state for display
  const [phaseTimer, setPhaseTimer] = useState(GAME_CONFIG.BETTING_DURATION);
  const [gamePhase, setGamePhase] = useState(PHASES.BETTING);
  
  // Refs for tracking real values
  const mainTimerRef = useRef(GAME_CONFIG.ROUND_DURATION);
  const gamePhaseRef = useRef(PHASES.BETTING);
  const lastPhaseChangeRef = useRef(null);
  
  // Animation and network refs
  const socketRef = useRef(null);
  const animationRef = useRef(null);
  const localTimerActiveRef = useRef(false);
  const lastUpdateTimeRef = useRef(performance.now());
  
  // Calculate proper phase timer based on main timer and current phase
  const calculatePhaseTimer = useCallback(() => {
    const mainTimer = mainTimerRef.current;
    
    // Timer calculations based on total round time of 30 seconds
    // BETTING: 22 seconds (30 to 8)
    // RESULT: 5 seconds (8 to 3)
    // RESET: 3 seconds (3 to 0)
    
    if (gamePhaseRef.current === PHASES.BETTING) {
      // For BETTING phase: count down from 22 to 1
      // When main timer is 30, we want to show 22
      // When main timer is 9, we want to show 1
      if (mainTimer >= 9 && mainTimer <= 30) {
        return Math.max(1, Math.ceil(mainTimer - 8) - 1);
      } else {
        return 22; // Default for safety
      }
    } 
    else if (gamePhaseRef.current === PHASES.RESULT) {
      // For RESULT phase: count down from 5 to 1
      // When main timer is 8, we want to show 5
      // When main timer is 4, we want to show 1
      if (mainTimer >= 4 && mainTimer <= 8) {
        return Math.max(1, Math.ceil(mainTimer - 3));
      } else {
        return 5; // Default for safety
      }
    }
    else if (gamePhaseRef.current === PHASES.RESET) {
      // For RESET phase: count down from 3 to 1
      // When main timer is 3, we want to show 3
      // When main timer is 1, we want to show 1
      if (mainTimer >= 1 && mainTimer <= 3) {
        return Math.max(1, Math.ceil(mainTimer));
      } else {
        return 3; // Default for safety
      }
    }
    
    return 1; // Fallback
  }, []);
  
  // Update the display timer smoothly
  const updateDisplayTimer = useCallback(() => {
    const now = performance.now();
    const elapsed = (now - lastUpdateTimeRef.current) / 1000;
    lastUpdateTimeRef.current = now;
    
    // Calculate the target phase timer value
    const targetPhaseTimer = calculatePhaseTimer();
    
    // Smoothly update the displayed phase timer
    setPhaseTimer(prevTimer => {
      // Move toward target value with slight interpolation for smoothness
      const diff = targetPhaseTimer - prevTimer;
      
      if (Math.abs(diff) < 0.1) {
        return targetPhaseTimer; // Snap to exact value when very close
      } else if (diff > 0) {
        return Math.min(targetPhaseTimer, prevTimer + elapsed * 5); // Move up faster
      } else {
        return Math.max(targetPhaseTimer, prevTimer - elapsed * 5); // Move down faster
      }
    });
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(updateDisplayTimer);
  }, [calculatePhaseTimer]);
  
  // Start animation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(updateDisplayTimer);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [updateDisplayTimer]);
  
  // Connect to socket server
  useEffect(() => {
    console.log('Connecting to local game server...');
    socketRef.current = io(SERVER_CONFIG.BASE_URL, {
      ...SERVER_CONFIG.SOCKET_OPTIONS,
      transports: ['websocket'], // Force websocket for local connections
    });
    
    // Set connection timeout
    const connectionTimeout = setTimeout(() => {
      if (!socketRef.current?.connected && SERVER_CONFIG.USE_LOCAL_FALLBACK) {
        console.warn('Local server connection timeout - using fallback timer');
        localTimerActiveRef.current = true;
        startLocalFallbackTimer();
      }
    }, SERVER_CONFIG.CONNECTION_TIMEOUT);

    // Process server updates
    socketRef.current.on('timerUpdate', (data) => {
      // Update main timer
      mainTimerRef.current = data.timer;
      
      // Clear timeout - we have connection
      clearTimeout(connectionTimeout);
      localTimerActiveRef.current = false;
      
      // Handle phase changes
      if (data.phase !== gamePhaseRef.current) {
        const oldPhase = gamePhaseRef.current;
        gamePhaseRef.current = data.phase;
        setGamePhase(data.phase);
        
        console.log(`Phase changed from ${oldPhase} to ${data.phase}`);
        
        // Reset the phase timer when phase changes for clean transitions
        const newPhaseTimer = data.phase === PHASES.BETTING ? GAME_CONFIG.BETTING_DURATION :
                             data.phase === PHASES.RESULT ? GAME_CONFIG.RESULT_DURATION :
                             GAME_CONFIG.RESET_DURATION;
        
        if (onPhaseChange) {
          onPhaseChange(data.phase);
        }
        
        if (data.phase === PHASES.RESULT && onDetermineWinner) {
          console.log('Server triggered determine winner');
          onDetermineWinner();
        }
      }
    });

    // Connection handling
    socketRef.current.on('connect', () => {
      console.log('Connected to local game server');
      localTimerActiveRef.current = false;
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Local server connection error:', error);
      if (!localTimerActiveRef.current && SERVER_CONFIG.USE_LOCAL_FALLBACK) {
        localTimerActiveRef.current = true;
        startLocalFallbackTimer();
      }
    });

    // Clean up
    return () => {
      if (socketRef.current) {
        console.log('Disconnecting from local game server');
        socketRef.current.disconnect();
      }
      clearTimeout(connectionTimeout);
    };
  }, [onPhaseChange, onDetermineWinner]);

  // Fallback local timer implementation
  const localTimerRef = useRef(null);
  
  const startLocalFallbackTimer = useCallback(() => {
    if (localTimerRef.current) {
      cancelAnimationFrame(localTimerRef.current);
    }
    
    console.warn('Starting smooth local fallback timer');
    
    // Initialize values
    mainTimerRef.current = 30;
    gamePhaseRef.current = PHASES.BETTING;
    setGamePhase(PHASES.BETTING);
    
    if (onPhaseChange) {
      onPhaseChange(PHASES.BETTING);
    }
    
    // Use performance API for smooth animation
    let lastTickTime = performance.now();
    
    const tick = () => {
      if (!localTimerActiveRef.current) {
        return; // Stop if server connection restored
      }
      
      const now = performance.now();
      const deltaTime = (now - lastTickTime) / 1000; // Convert to seconds
      lastTickTime = now;
      
      // Smooth decrease of timer value
      mainTimerRef.current -= deltaTime;
      
      // Reset timer if it's complete
      if (mainTimerRef.current <= 0) {
        mainTimerRef.current = 30;
      }
      
      // Update phase based on timer
      const currentPhase = gamePhaseRef.current;
      let newPhase = currentPhase;
      
      if (mainTimerRef.current > 8) {
        newPhase = PHASES.BETTING;
      } else if (mainTimerRef.current > 3) {
        newPhase = PHASES.RESULT;
      } else {
        newPhase = PHASES.RESET;
      }
      
      // Handle phase change
      if (newPhase !== currentPhase) {
        gamePhaseRef.current = newPhase;
        setGamePhase(newPhase);
        
        if (onPhaseChange) {
          onPhaseChange(newPhase);
        }
        
        if (newPhase === PHASES.RESULT && onDetermineWinner) {
          onDetermineWinner();
        }
      }
      
      // Continue the animation
      localTimerRef.current = requestAnimationFrame(tick);
    };
    
    // Start the animation loop
    localTimerRef.current = requestAnimationFrame(tick);
  }, [onPhaseChange, onDetermineWinner]);

  // Clean up local timer
  useEffect(() => {
    return () => {
      if (localTimerRef.current) {
        cancelAnimationFrame(localTimerRef.current);
      }
    };
  }, []);

  // Determine timer color based on phase
  const timerColor = useCallback(() => {
    if (gamePhase === PHASES.BETTING) return '#00ff00'; // Green
    if (gamePhase === PHASES.RESULT) return '#ffd700';  // Yellow
    return '#ff4b5c';  // Red for reset phase
  }, [gamePhase]);

  return {
    timer: Math.ceil(mainTimerRef.current), // Original timer
    phaseTimer: Math.ceil(phaseTimer),       // Phase-specific countdown
    gamePhase,
    timerColor
  };
}