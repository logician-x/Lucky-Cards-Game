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
  const lastServerUpdateRef = useRef(Date.now());
  const serverSyncedRef = useRef(false);
  
  // Animation and network refs
  const socketRef = useRef(null);
  const animationRef = useRef(null);
  const localTimerActiveRef = useRef(false);
  const lastUpdateTimeRef = useRef(performance.now());
  const connectionAttemptRef = useRef(0);
  const maxConnectionAttempts = 5; // Increased from 3 to 5
  const reconnectingRef = useRef(false);
  const roundCompletionCountRef = useRef(0); // Track round completions
  
  // Deduplicate phase change triggers
  const lastPhaseChangeTimeRef = useRef({});
  const phaseChangeCooldown = 500; // ms
  
  // Calculate proper phase timer based on main timer and current phase
  const calculatePhaseTimer = useCallback(() => {
    const mainTimer = mainTimerRef.current;
    
    if (gamePhaseRef.current === PHASES.BETTING) {
      if (mainTimer >= 9 && mainTimer <= 30) {
        return Math.max(1, Math.ceil(mainTimer - 8) - 1);
      } else {
        return 22;
      }
    } 
    else if (gamePhaseRef.current === PHASES.RESULT) {
      if (mainTimer >= 4 && mainTimer <= 8) {
        return Math.max(1, Math.ceil(mainTimer - 3));
      } else {
        return 5;
      }
    }
    else if (gamePhaseRef.current === PHASES.RESET) {
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
    
    // Safely call the phase change callback
    try {
      if (onPhaseChange) {
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
        }, 50);
      }
    } catch (error) {
      console.error('Error in phase change callback:', error);
    }
  }, [onPhaseChange, onDetermineWinner]);

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
    
    // Update local timer if server connection is lost
    if (localTimerActiveRef.current) {
      if (Date.now() - lastServerUpdateRef.current > SERVER_CONFIG.CONNECTION_TIMEOUT * 3) {
        // Decrease the timer at a consistent rate
        mainTimerRef.current = Math.max(0, mainTimerRef.current - elapsed);
        
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
            console.log('Round completed in local mode, resetting connection attempts');
            connectionAttemptRef.current = 0; // Reset connection counter
            
            setTimeout(() => {
              console.log('Attempting reconnection after round completion');
              connectToServer();
              reconnectingRef.current = false;
            }, 1000);
          }
        } else if (mainTimerRef.current <= 3 && gamePhaseRef.current !== PHASES.RESET) {
          gamePhaseRef.current = PHASES.RESET;
          setGamePhase(PHASES.RESET);
          safeHandlePhaseChange(PHASES.RESET);
        } else if (mainTimerRef.current <= 8 && mainTimerRef.current > 3 && gamePhaseRef.current !== PHASES.RESULT) {
          gamePhaseRef.current = PHASES.RESULT;
          setGamePhase(PHASES.RESULT);
          safeHandlePhaseChange(PHASES.RESULT);
        } else if (mainTimerRef.current > 8 && gamePhaseRef.current !== PHASES.BETTING) {
          gamePhaseRef.current = PHASES.BETTING;
          setGamePhase(PHASES.BETTING);
          safeHandlePhaseChange(PHASES.BETTING);
        }
      }
    }
    
    // Calculate the target phase timer value
    const targetPhaseTimer = calculatePhaseTimer();
    
    // Smoothly update the displayed phase timer
    setPhaseTimer(prevTimer => {
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
  }, [calculatePhaseTimer, safeHandlePhaseChange, connectToServer]);
  
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
      transports: ['websocket'], // Force websocket for local connections
      reconnection: true,
      reconnectionAttempts: 5, // Increased from 3
      reconnectionDelay: 1000,
      timeout: SERVER_CONFIG.CONNECTION_TIMEOUT,
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
      // Mark as server synced
      serverSyncedRef.current = true;
      lastServerUpdateRef.current = Date.now();
      
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
        safeHandlePhaseChange(data.phase);
        
        // Track round completions when transitioning to RESET phase
        if (data.phase === PHASES.RESET) {
          console.log('Detected RESET phase, preparing for potential reconnection');
          roundCompletionCountRef.current++;
          
          // Force connection reset every few rounds to avoid stale connections
          if (roundCompletionCountRef.current % 3 === 0) {
            console.log('Performing preventative connection reset after multiple rounds');
            setTimeout(() => {
              if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                connectionAttemptRef.current = 0; // Reset counter
                
                setTimeout(() => {
                  if (!reconnectingRef.current) {
                    reconnectingRef.current = true;
                    connectToServer();
                    reconnectingRef.current = false;
                  }
                }, 1000);
              }
            }, 500);
          }
        }
      }
      
      // If timer is very low, prepare for potential disconnection
      if (data.timer <= 3 && data.phase === PHASES.RESET) {
        console.log('End of round detected, preparing for potential reconnection');
      }
    });

    // Connection handling
    socketRef.current.on('connect', () => {
      console.log('Connected to game server');
      localTimerActiveRef.current = false;
      connectionAttemptRef.current = 0; // Reset attempts counter on successful connection
      lastServerUpdateRef.current = Date.now(); // Update the timestamp on successful connection
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Server connection error:', error);
      
      // Try to reset connection attempts occasionally to prevent permanent lockout
      const now = Date.now();
      if (now - lastServerUpdateRef.current > 60000) { // 1 minute
        console.log('Resetting connection attempt counter due to extended outage');
        connectionAttemptRef.current = 0;
      }
      
      // Try to reconnect
      setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
          if (!reconnectingRef.current) {
            reconnectingRef.current = true;
            connectToServer();
            reconnectingRef.current = false;
          }
        }
      }, 2000);
      
      if (!localTimerActiveRef.current && SERVER_CONFIG.USE_LOCAL_FALLBACK) {
        localTimerActiveRef.current = true;
        startLocalFallbackTimer();
      }
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log(`Disconnected from server: ${reason}`);
      
      // Reset connection counter if the disconnect happens after a game phase
      if (gamePhaseRef.current === PHASES.RESET || mainTimerRef.current <= 3) {
        console.log('Disconnected during/after reset phase, resetting connection counter and attempting reconnect');
        connectionAttemptRef.current = 0; // Reset the counter to ensure we can reconnect
        
        setTimeout(() => {
          if (!reconnectingRef.current) {
            reconnectingRef.current = true;
            connectToServer();
            reconnectingRef.current = false;
          }
        }, 1500);
      } else if (reason === 'io server disconnect' || reason === 'transport close') {
        // The server has forcefully disconnected
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
      
      // Switch to local timer if not already active
      if (!localTimerActiveRef.current && SERVER_CONFIG.USE_LOCAL_FALLBACK) {
        localTimerActiveRef.current = true;
        startLocalFallbackTimer();
      }
    });
    
    // Handle reconnect attempts
    socketRef.current.io.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnection attempt ${attempt}`);
    });
    
    socketRef.current.io.on("reconnect", (attempt) => {
      console.log(`Reconnected after ${attempt} attempts`);
      connectionAttemptRef.current = 0;
      localTimerActiveRef.current = false;
    });
    
    socketRef.current.io.on("reconnect_error", (error) => {
      console.error("Reconnection error:", error);
    });
    
    socketRef.current.io.on("reconnect_failed", () => {
      console.error("Failed to reconnect");
      if (!localTimerActiveRef.current && SERVER_CONFIG.USE_LOCAL_FALLBACK) {
        localTimerActiveRef.current = true;
        startLocalFallbackTimer();
      }
    });
    
  }, [safeHandlePhaseChange, startLocalFallbackTimer]);
  
  // Resolve circular dependency
  useEffect(() => {
    const updateDisplayTimerFunction = updateDisplayTimer;
    // Start animation loop
    animationRef.current = requestAnimationFrame(updateDisplayTimerFunction);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [updateDisplayTimer]);
  
  // Connect to server on component mount
  useEffect(() => {
    // Reset connection counter on initial mount
    connectionAttemptRef.current = 0;
    connectToServer();
    
    // Setup a heartbeat to check connection status
    const heartbeatInterval = setInterval(() => {
      const now = Date.now();
      // If we haven't received an update in a while and we're not in local mode
      if ((now - lastServerUpdateRef.current > SERVER_CONFIG.CONNECTION_TIMEOUT * 2) && 
          !localTimerActiveRef.current && 
          socketRef.current) {
        console.log('Server heartbeat missing, checking connection...');
        
        // Reset connection attempts if we've been in local mode too long
        if (now - lastServerUpdateRef.current > 60000) { // 1 minute
          connectionAttemptRef.current = 0;
        }
        
        // If socket exists but seems inactive
        if (socketRef.current && (!socketRef.current.connected || socketRef.current.disconnected)) {
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
      clearInterval(heartbeatInterval);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connectToServer]);

  // Clean up local timer
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
    timer: Math.ceil(mainTimerRef.current), // Original timer
    phaseTimer: Math.ceil(phaseTimer),       // Phase-specific countdown
    gamePhase,
    timerColor,
    isServerConnected: !localTimerActiveRef.current
  };
}