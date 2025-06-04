import { useState, useEffect, useRef, useCallback } from 'react';
import { PHASES } from '../constants/gameConstants';
import io from 'socket.io-client';
import { SERVER_CONFIG, GAME_CONFIG } from '../game_server/serverConfig';

export default function useServerGameTimer(onPhaseChange, onDetermineWinner) {
  // Client-side state for display
  const [phaseTimer, setPhaseTimer] = useState(20); // Start with betting phase timer
  const [gamePhase, setGamePhase] = useState(PHASES.BETTING);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs for tracking real values
  const mainTimerRef = useRef(GAME_CONFIG.ROUND_DURATION);
  const gamePhaseRef = useRef(PHASES.BETTING);
  const lastServerUpdateRef = useRef(Date.now());
  const serverSyncedRef = useRef(false);
  const serverTimestampRef = useRef(0);
  const clientTimestampRef = useRef(0);
  
  // Animation and network refs
  const socketRef = useRef(null);
  const animationRef = useRef(null);
  const localTimerActiveRef = useRef(false);
  const lastUpdateTimeRef = useRef(performance.now());
  const connectionAttemptRef = useRef(0);
  const maxConnectionAttempts = 5;
  const reconnectingRef = useRef(false);
  const roundCompletionCountRef = useRef(0);
  
  // Target timer value for smoother transitions
  const targetPhaseTimerRef = useRef(20);
  const lastPhaseRef = useRef(PHASES.BETTING);
  
  // Deduplicate phase change triggers
  const lastPhaseChangeTimeRef = useRef({});
  const phaseChangeCooldown = 500; // ms
  
  // Calculate proper phase timer based on main timer and current phase
  const calculatePhaseTimer = useCallback(() => {
    const mainTimer = mainTimerRef.current;
    
    if (gamePhaseRef.current === PHASES.BETTING) {
      // Main timer 30-9: Phase timer 20-1
      if (mainTimer >= 9 && mainTimer <= 30) {
        return Math.max(1, Math.ceil(mainTimer - 8));
      } else {
        return 20;
      }
    } 
    else if (gamePhaseRef.current === PHASES.RESULT) {
      // Main timer 8-4: Phase timer 5-1
      if (mainTimer >= 4 && mainTimer <= 8) {
        return Math.max(1, Math.ceil(mainTimer - 3));
      } else {
        return 5;
      }
    }
    else if (gamePhaseRef.current === PHASES.RESET) {
      // Main timer 3-1: Phase timer 3-1
      if (mainTimer >= 1 && mainTimer <= 3) {
        return Math.max(1, Math.ceil(mainTimer));
      } else {
        return 3;
      }
    }
    
    return 1; // Fallback
  }, []);
  
  // Safe phase change handler with debouncing
  const safeHandlePhaseChange = useCallback((newPhase) => {
    const now = Date.now();
    const lastChange = lastPhaseChangeTimeRef.current[newPhase] || 0;
    
    // Prevent duplicate phase change triggers
    if (now - lastChange < phaseChangeCooldown) {
      console.log(`Skipping duplicate phase change to ${newPhase}`);
      return;
    }
    
    lastPhaseChangeTimeRef.current[newPhase] = now;
    lastPhaseRef.current = newPhase;
    
    // Update target timer for smooth transitions
    targetPhaseTimerRef.current = calculatePhaseTimer();
    
    // Safely call the phase change callback
    try {
      if (onPhaseChange) {
        console.log(`Phase changing to: ${newPhase}`);
        onPhaseChange(newPhase);
      }
      
      // Special case for RESULT phase to determine winner
      if (newPhase === PHASES.RESULT && onDetermineWinner) {
        // Small delay to ensure UI is ready for winner animation
        setTimeout(() => {
          try {
            onDetermineWinner();
          } catch (error) {
            console.error('Error in determine winner callback:', error);
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error in phase change callback:', error);
    }
  }, [onPhaseChange, onDetermineWinner, calculatePhaseTimer]);

  // Fallback local timer implementation
  const startLocalFallbackTimer = useCallback(() => {
    console.warn('Starting local fallback timer');
    
    // Skip initialization if we have server data
    if (!serverSyncedRef.current) {
      // Initialize values
      mainTimerRef.current = GAME_CONFIG.ROUND_DURATION;
      gamePhaseRef.current = PHASES.BETTING;
      setGamePhase(PHASES.BETTING);
      safeHandlePhaseChange(PHASES.BETTING);
    }
  }, [safeHandlePhaseChange]);
  
  // Update the display timer smoothly
  const updateDisplayTimer = useCallback(() => {
    const now = performance.now();
    const elapsed = (now - lastUpdateTimeRef.current) / 1000;
    lastUpdateTimeRef.current = now;
    
    // Avoid huge time jumps if tab was inactive
    const cappedElapsed = Math.min(elapsed, 0.2);
    
    // Update local timer if server connection is lost
    if (localTimerActiveRef.current) {
      if (Date.now() - lastServerUpdateRef.current > SERVER_CONFIG.CONNECTION_TIMEOUT * 3) {
        // Decrease the timer at a consistent rate
        mainTimerRef.current = Math.max(0, mainTimerRef.current - cappedElapsed);
        
        // Handle timer looping and phase changes
        if (mainTimerRef.current <= 0) {
          mainTimerRef.current = GAME_CONFIG.ROUND_DURATION;
          gamePhaseRef.current = PHASES.BETTING;
          setGamePhase(PHASES.BETTING);
          safeHandlePhaseChange(PHASES.BETTING);
          
          // Track round completions
          roundCompletionCountRef.current++;
          
          // Try to reconnect when the round resets
          if (!reconnectingRef.current) {
            reconnectingRef.current = true;
            console.log('Round completed in local mode, attempting reconnection');
            connectionAttemptRef.current = 0; // Reset connection counter
            
            setTimeout(() => {
              connectToServer();
              reconnectingRef.current = false;
            }, 1000);
          }
        } else {
          // Update phase based on timer
          let newPhase;
          if (mainTimerRef.current > 8) {
            newPhase = PHASES.BETTING;
          } else if (mainTimerRef.current > 3) {
            newPhase = PHASES.RESULT;
          } else {
            newPhase = PHASES.RESET;
          }
          
          if (newPhase !== gamePhaseRef.current) {
            gamePhaseRef.current = newPhase;
            setGamePhase(newPhase);
            safeHandlePhaseChange(newPhase);
          }
        }
      }
    }
    
    // Calculate the target phase timer value
    const targetPhaseTimer = calculatePhaseTimer();
    targetPhaseTimerRef.current = targetPhaseTimer;
    
    // Smoothly update the displayed phase timer with improved interpolation
    setPhaseTimer(prevTimer => {
      const diff = targetPhaseTimer - prevTimer;
      
      // Determine the appropriate animation speed based on context
      let speed = 4.0; // base speed
      
      // When phases change, transition more quickly
      if (lastPhaseRef.current !== gamePhaseRef.current) {
        speed = 8.0;
      }
      
      // For large differences, move faster
      if (Math.abs(diff) > 5) {
        speed = 12.0;
      }
      
      // For very small differences, snap to target
      if (Math.abs(diff) < 0.1) {
        return targetPhaseTimer;
      }
      
      // Apply smooth interpolation
      if (diff > 0) {
        return Math.min(targetPhaseTimer, prevTimer + cappedElapsed * speed);
      } else {
        return Math.max(targetPhaseTimer, prevTimer - cappedElapsed * speed);
      }
    });
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(updateDisplayTimer);
  }, [calculatePhaseTimer, safeHandlePhaseChange]);
  
  // Connect to socket server
  const connectToServer = useCallback(() => {
    // Reset connection attempts if enough time has passed since last attempt
    const timeSinceLastUpdate = Date.now() - lastServerUpdateRef.current;
    if (timeSinceLastUpdate > 60000) { // 1 minute
      console.log('Resetting connection attempt counter due to timeout');
      connectionAttemptRef.current = 0;
    }
    
    if (connectionAttemptRef.current >= maxConnectionAttempts) {
      console.log(`Max connection attempts (${maxConnectionAttempts}) reached, using local timer`);
      if (!localTimerActiveRef.current) {
        localTimerActiveRef.current = true;
        startLocalFallbackTimer();
      }
      
      // Set loading to false after max attempts
      setIsLoading(false);
      
      // Schedule retry after some time
      setTimeout(() => {
        console.log('Retrying server connection after cooldown period');
        connectionAttemptRef.current = 0; // Reset counter after cooldown
      }, 30000); // Try again after 30 seconds
      
      return;
    }
    
    connectionAttemptRef.current++;
    console.log(`Connecting to server (attempt ${connectionAttemptRef.current}/${maxConnectionAttempts})...`);
    
    // Close existing socket if it exists
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    socketRef.current = io(SERVER_CONFIG.BASE_URL, {
      ...SERVER_CONFIG.SOCKET_OPTIONS,
      transports: ['websocket', 'polling'], // Support both transports
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: SERVER_CONFIG.CONNECTION_TIMEOUT,
    });
    
    // Set connection timeout
    const connectionTimeout = setTimeout(() => {
      if (!socketRef.current?.connected && SERVER_CONFIG.USE_LOCAL_FALLBACK) {
        console.warn('Local server connection timeout - using fallback timer');
        localTimerActiveRef.current = true;
        startLocalFallbackTimer();
        setIsLoading(false);
      }
    }, SERVER_CONFIG.CONNECTION_TIMEOUT);

    // Process server updates
    socketRef.current.on('timerUpdate', (data) => {
      // Mark as server synced
      serverSyncedRef.current = true;
      lastServerUpdateRef.current = Date.now();
      
      // Store server timestamp for sync
      if (data.timestamp) {
        serverTimestampRef.current = data.timestamp;
        clientTimestampRef.current = Date.now();
      }
      
      // Update main timer with server data
      mainTimerRef.current = data.timer;
      
      // Clear timeout - we have connection
      clearTimeout(connectionTimeout);
      localTimerActiveRef.current = false;
      setIsConnected(true);
      setIsLoading(false);
      
      // Handle phase changes
      if (data.phase !== gamePhaseRef.current) {
        const oldPhase = gamePhaseRef.current;
        gamePhaseRef.current = data.phase;
        setGamePhase(data.phase);
        
        console.log(`Phase changed from ${oldPhase} to ${data.phase}, Timer: ${data.timer}, PhaseTimer: ${data.phaseTimer}`);
        safeHandlePhaseChange(data.phase);
        
        // Track round completions when transitioning to RESET or back to BETTING
        if (data.phase === PHASES.BETTING && oldPhase === PHASES.RESET) {
          console.log('New round started');
          roundCompletionCountRef.current++;
        }
      }
      
      // Use server-provided phase timer for better accuracy
      if (data.phaseTimer !== undefined) {
        targetPhaseTimerRef.current = Math.max(1, data.phaseTimer);
      }
    });

    // Connection handling
    socketRef.current.on('connect', () => {
      console.log('Connected to game server');
      localTimerActiveRef.current = false;
      connectionAttemptRef.current = 0; // Reset attempts counter on successful connection
      lastServerUpdateRef.current = Date.now(); // Update the timestamp on successful connection
      setIsConnected(true);
      setIsLoading(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Server connection error:', error);
      setIsConnected(false);
      setIsLoading(false);
      
      if (!localTimerActiveRef.current && SERVER_CONFIG.USE_LOCAL_FALLBACK) {
        localTimerActiveRef.current = true;
        startLocalFallbackTimer();
      }
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log(`Disconnected from server: ${reason}`);
      setIsConnected(false);
      
      // Switch to local timer if not already active
      if (!localTimerActiveRef.current && SERVER_CONFIG.USE_LOCAL_FALLBACK) {
        localTimerActiveRef.current = true;
        startLocalFallbackTimer();
      }
      
      // Attempt reconnection based on disconnect reason
      if (reason === 'io server disconnect' || reason === 'transport close') {
        console.log('Server forced disconnect, resetting connection counter');
        connectionAttemptRef.current = 0; // Reset counter to ensure we can reconnect
        
        setTimeout(() => {
          if (!reconnectingRef.current) {
            reconnectingRef.current = true;
            connectToServer();
            reconnectingRef.current = false;
          }
        }, 2000);
      }
    });
    
    // Handle reconnect events
    socketRef.current.io.on("reconnect", (attempt) => {
      console.log(`Reconnected after ${attempt} attempts`);
      connectionAttemptRef.current = 0;
      localTimerActiveRef.current = false;
      setIsConnected(true);
    });
    
    socketRef.current.io.on("reconnect_failed", () => {
      console.error("Failed to reconnect");
      setIsConnected(false);
      if (!localTimerActiveRef.current && SERVER_CONFIG.USE_LOCAL_FALLBACK) {
        localTimerActiveRef.current = true;
        startLocalFallbackTimer();
      }
    });
    
  }, [safeHandlePhaseChange, startLocalFallbackTimer]);
  
  // Initialize animation loop
  useEffect(() => {
    // Start animation loop
    lastUpdateTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(updateDisplayTimer);
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [updateDisplayTimer]);
  
  // Connect to server on component mount
  useEffect(() => {
    // Reset connection counter on initial mount
    connectionAttemptRef.current = 0;
    
    // Clear loading state after timeout
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    connectToServer();
    
    // Setup a heartbeat to check connection status
    const heartbeatInterval = setInterval(() => {
      const now = Date.now();
      // If we haven't received an update in a while and we're not in local mode
      if ((now - lastServerUpdateRef.current > SERVER_CONFIG.CONNECTION_TIMEOUT * 2) && 
          socketRef.current && 
          !localTimerActiveRef.current) {
        console.log('Server heartbeat missing, checking connection...');
        setIsConnected(false);
        
        // If socket exists but seems inactive, try reconnecting
        if (!socketRef.current.connected) {
          console.log('Socket appears disconnected, attempting reconnect');
          if (!reconnectingRef.current) {
            reconnectingRef.current = true;
            connectToServer();
            reconnectingRef.current = false;
          }
        }
      }
    }, 5000); // Check every 5 seconds
    
    // Clean up
    return () => {
      clearTimeout(loadingTimeout);
      clearInterval(heartbeatInterval);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connectToServer]);

  // Clean up animation frame
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
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
    timer: Math.ceil(mainTimerRef.current), // Original main timer
    phaseTimer: Math.max(1, Math.round(phaseTimer)), // Rounded phase timer (never below 1)
    gamePhase,
    timerColor,
    isConnected,
    isLoading
  };
}