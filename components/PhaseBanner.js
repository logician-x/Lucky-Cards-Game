import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import {styles} from '../styles/phasebanner.styles';
// Game phase constants
const PHASES = {
  BETTING: 'betting',    // 0-22s
  RESULT: 'result',      // 22-27s
  RESET: 'reset'         // 27-30s
};

// Phase transition times in seconds
const PHASE_TIMES = {
  BETTING_START: 0,
  BETTING_END: 22,
  RESULT_START: 22,
  RESULT_END: 27,
  RESET_START: 27,
  RESET_END: 30
};

// Message types
const MESSAGE_TYPES = {
  START_BETTING: 'start_betting',
  STOP_BETTING: 'stop_betting',
  NEW_GAME: 'new_game'
};

// Get screen dimensions for animations
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PhaseBanner = ({ gameTime, phase, onGameComplete }) => {
  // Center message animation values
  const centerTextOpacity = useRef(new Animated.Value(0)).current;
  const centerTextScale = useRef(new Animated.Value(0.5)).current;
  
  // Reset phase animation values
  const resetCircleScale = useRef(new Animated.Value(0)).current;
  const resetCircleOpacity = useRef(new Animated.Value(0.8)).current;
  
  // NEW: Full-screen overlay for new game animation
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const overlayScale = useRef(new Animated.Value(0.8)).current;
  
  // NEW: Wave animations
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;
  
  // NEW: Star burst animation value
  const burstScale = useRef(new Animated.Value(0)).current;
  const burstOpacity = useRef(new Animated.Value(0)).current;
  
  // Fix: Properly initialize particleValues with array of animation values
  const particleValues = useRef([]);
  
  // NEW: Large particles for full-screen effect
  const largeParticleValues = useRef([]);
  
  // Initialize particle animations on first render
  useEffect(() => {
    particleValues.current = Array(12).fill().map(() => ({
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }));
    
    // NEW: Initialize large particles for full-screen effect
    largeParticleValues.current = Array(20).fill().map(() => ({
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }));
  }, []);
  
  // Animation references
  const centerTextAnimRef = useRef(null);
  const resetAnimRef = useRef(null);
  
  // Sound reference
  const [sound, setSound] = useState();
  
  // Current message type
  const [messageType, setMessageType] = useState(null);
  // Center text visibility state
  const [showCenterText, setShowCenterText] = useState(false);
  // Reset animation visibility state
  const [showResetAnimation, setShowResetAnimation] = useState(false);
  // NEW: Full-screen animation state
  const [showFullScreenAnimation, setShowFullScreenAnimation] = useState(false);
  
  // Previous phase tracking
  const prevPhaseRef = useRef(null);
  // Flag to track initial component mount
  const initialMountRef = useRef(true);
  // Timer ref for the "Stop Betting" early notification
  const stopBettingTimerRef = useRef(null);
  
  // Initialize Audio
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Request audio permissions (important for iOS)
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          staysActiveInBackground: false,
        });
        console.log('Audio initialized successfully');
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    };
    
    initAudio();
    
    // Clean up sound on component unmount
    return () => {
      if (sound) {
        console.log('Unloading sound');
        sound.unloadAsync();
      }
      
      // Clear any existing timer
      if (stopBettingTimerRef.current) {
        clearTimeout(stopBettingTimerRef.current);
      }
    };
  }, []);
  
  // First mount initialization
  useEffect(() => {
    if (phase === PHASES.BETTING && initialMountRef.current) {
      console.log('First initialization, showing START_BETTING');
      showMessage(MESSAGE_TYPES.START_BETTING);
      initialMountRef.current = false;
    }
  }, [phase]);
  
  // Watch for phase changes
  useEffect(() => {
    console.log(`Current phase: ${phase}, Previous phase: ${prevPhaseRef.current}`);
    
    if (phase && phase !== prevPhaseRef.current) {
      // Phase has changed
      switch (phase) {
        case PHASES.BETTING:
          if (!initialMountRef.current) { // Don't show twice on first mount
            console.log('Phase changed to betting, showing START_BETTING');
            showMessage(MESSAGE_TYPES.START_BETTING);
            
            // Set timer for early "Stop Betting" notification
            // This will show "Stop Betting" 2 seconds before the end of betting phase
            const timeUntilStopBetting = (PHASE_TIMES.BETTING_END - PHASE_TIMES.BETTING_START - 2) * 1000;
            console.log(`Setting timer for Stop Betting notification in ${timeUntilStopBetting}ms`);
            
            // Clear any existing timer first
            if (stopBettingTimerRef.current) {
              clearTimeout(stopBettingTimerRef.current);
            }
            
            stopBettingTimerRef.current = setTimeout(() => {
              console.log('Timer fired - showing STOP_BETTING message early');
              showMessage(MESSAGE_TYPES.STOP_BETTING);
            }, timeUntilStopBetting);
          }
          break;
        case PHASES.RESULT:
          // We don't need to show STOP_BETTING here anymore since we're showing it early
          // But we'll keep the code commented in case you want to revert
          // console.log('Phase changed to result, showing STOP_BETTING');
          // showMessage(MESSAGE_TYPES.STOP_BETTING);
          break;
        case PHASES.RESET:
          // Show NEW_GAME message when entering reset phase
          console.log('Phase changed to reset, showing NEW_GAME');
          showMessage(MESSAGE_TYPES.NEW_GAME);
          // Start the full screen animation first, then the reset animation
          playFullScreenAnimation();
          break;
      }
    }
    
    // Update previous phase reference
    prevPhaseRef.current = phase;
  }, [phase]);
  
  // NEW: Separate useEffect that watches gameTime to trigger "Stop Betting" message
  // This is an alternative approach if you want to use gameTime instead of setTimeout
  useEffect(() => {
    if (gameTime && phase === PHASES.BETTING) {
      // Calculate seconds into the betting phase
      const secondsIntoBetting = gameTime - PHASE_TIMES.BETTING_START;
      
      // Show "Stop Betting" message 2 seconds before the end of betting phase
      if (secondsIntoBetting >= PHASE_TIMES.BETTING_END - 2 && secondsIntoBetting < PHASE_TIMES.BETTING_END) {
        // Only show if we haven't already shown it (prevents multiple triggers)
        if (messageType !== MESSAGE_TYPES.STOP_BETTING && !showCenterText) {
          console.log('gameTime triggered STOP_BETTING message');
          showMessage(MESSAGE_TYPES.STOP_BETTING);
        }
      }
    }
  }, [gameTime, phase]);
  
  // Show message based on message type
  const showMessage = async (type) => {
    console.log(`Showing message: ${type}`);
    
    // Reset animations
    centerTextOpacity.setValue(0);
    centerTextScale.setValue(0.5);
    
    // Update message type
    setMessageType(type);
    
    // Play sound
    await playSound(type);
    
    // Show text and start animations
    setShowCenterText(true);
    
    // Improved text animations with smoother spring physics
    centerTextAnimRef.current = Animated.parallel([
      Animated.timing(centerTextOpacity, {
        toValue: 1,
        duration: 300, 
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic), // Added easing for smoother fade-in
      }),
      Animated.spring(centerTextScale, {
        toValue: 1,
        friction: 6, // Lower friction for smoother bounce
        tension: 50, // Higher tension for more energetic spring
        useNativeDriver: true,
      }),
    ]);
    
    centerTextAnimRef.current.start(() => {
      console.log('Center text animation completed');
    });
    
    // Show message for longer (1.5s) for NEW_GAME to match with the animation
    setTimeout(() => {
      hideMessage();
    }, type === MESSAGE_TYPES.NEW_GAME ? 1500 : 1000);
  };

  // Hide message with animation
  const hideMessage = () => {
    console.log('Hiding message');
    
    // Smoother exit animation with improved timing
    Animated.parallel([
      Animated.timing(centerTextOpacity, {
        toValue: 0,
        duration: 400, // Longer duration for smoother fade-out
        easing: Easing.out(Easing.cubic), // Added easing
        useNativeDriver: true,
      }),
      Animated.timing(centerTextScale, {
        toValue: 0.8,
        duration: 400,
        easing: Easing.out(Easing.cubic), // Added easing
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCenterText(false);
      setMessageType(null);
      console.log('Message hidden');
    });
  };
  
  // NEW: Play full-screen animation for new game
  const playFullScreenAnimation = () => {
    console.log('Playing full-screen new game animation');
    
    // Show full-screen animation
    setShowFullScreenAnimation(true);
    
    // Reset animation values
    overlayOpacity.setValue(0);
    overlayScale.setValue(0.8);
    waveAnim1.setValue(0);
    waveAnim2.setValue(0);
    waveAnim3.setValue(0);
    burstScale.setValue(0);
    burstOpacity.setValue(0);
    
    // Reset large particle values
    largeParticleValues.current.forEach(particle => {
      particle.translateX.setValue(0);
      particle.translateY.setValue(0);
      particle.rotate.setValue(0);
      particle.scale.setValue(0);
      particle.opacity.setValue(0);
    });
    
    // Create staggered wave animations
    const waveAnimations = [
      // First wave
      Animated.sequence([
        Animated.timing(waveAnim1, {
          toValue: 1,
          duration: 1500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim1, {
          toValue: 0,
          duration: 1000,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
      ]),
      // Second wave with delay
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(waveAnim2, {
          toValue: 1,
          duration: 1500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim2, {
          toValue: 0,
          duration: 1000,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
      ]),
      // Third wave with delay
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(waveAnim3, {
          toValue: 1,
          duration: 1500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim3, {
          toValue: 0,
          duration: 1000,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
      ]),
    ];
    
    // Create burst animation
    const burstAnimation = Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(burstScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(burstOpacity, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(burstOpacity, {
        toValue: 0,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    
    // Create overlay animation
    const overlayAnimation = Animated.sequence([
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0.7,
          duration: 500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.spring(overlayScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(2000),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    
    // Create large particle animations
    const largeParticleAnimations = largeParticleValues.current.map((particle, index) => {
      // Calculate random angle
      const angle = Math.random() * Math.PI * 2;
      // Random distance (further than small particles)
      const distance = 200 + Math.random() * 500;
      // Calculate end positions
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      // Random rotation and scale
      const rotation = Math.random() * 720 - 360; // -360 to 360 degrees
      const maxScale = 0.5 + Math.random() * 2.5; // 0.5 to 3.0
      
      return Animated.sequence([
        // Staggered delay
        Animated.delay(index * 50 + 100),
        Animated.parallel([
          // Translation X
          Animated.timing(particle.translateX, {
            toValue: endX,
            duration: 2000 + Math.random() * 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }),
          // Translation Y
          Animated.timing(particle.translateY, {
            toValue: endY,
            duration: 2000 + Math.random() * 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }),
          // Rotation
          Animated.timing(particle.rotate, {
            toValue: rotation,
            duration: 2000 + Math.random() * 1000,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          // Scale up and down
          Animated.sequence([
            // Scale up
            Animated.timing(particle.scale, {
              toValue: maxScale,
              duration: 500,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            // Scale down
            Animated.timing(particle.scale, {
              toValue: 0,
              duration: 1500,
              easing: Easing.in(Easing.cubic),
              useNativeDriver: true,
            }),
          ]),
          // Opacity (appear then fade)
          Animated.sequence([
            // Appear
            Animated.timing(particle.opacity, {
              toValue: 0.9,
              duration: 200,
              useNativeDriver: true,
            }),
            // Hold
            Animated.delay(800),
            // Fade
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 1000,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]);
    });
    
    // Run all animations together
    Animated.parallel([
      ...waveAnimations,
      burstAnimation,
      overlayAnimation,
      ...largeParticleAnimations,
    ]).start(() => {
      console.log('Full-screen animation completed');
      setShowFullScreenAnimation(false);
    });
  };
  
  // Play reset phase animation (original version)
  const playResetAnimation = () => {
    console.log('Playing reset animation');
    
    // Safety check: only proceed if particleValues is initialized
    if (!particleValues.current || particleValues.current.length === 0) {
      console.error('Particle values not initialized yet');
      return;
    }
    
    // Reset animation values
    resetCircleScale.setValue(0);
    resetCircleOpacity.setValue(0.8);
    
    // Reset particle values
    particleValues.current.forEach(particle => {
      particle.translateX.setValue(0);
      particle.translateY.setValue(0);
      particle.rotate.setValue(0);
      particle.opacity.setValue(0);
    });
    
    // Show reset animation
    setShowResetAnimation(true);
    
    // Create circle animation
    resetAnimRef.current = Animated.parallel([
      // Circle scale animation
      Animated.timing(resetCircleScale, {
        toValue: 3,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Circle fade animation
      Animated.timing(resetCircleOpacity, {
        toValue: 0,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    
    // Create staggered particle animations
    const particleAnimations = particleValues.current.map((particle, index) => {
      // Calculate angle for this particle (evenly distributed in a circle)
      const angle = (index / particleValues.current.length) * Math.PI * 2;
      // Random distance for the particle to travel (between 100 and 200)
      const distance = 100 + Math.random() * 150; // Increased maximum distance
      // Calculate end positions based on angle and distance
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      // Random rotation amount
      const rotation = Math.random() * 360;
      
      return Animated.sequence([
        // Staggered delay for smoother overall effect
        Animated.delay(index * 35),
        // Start particle animations in parallel
        Animated.parallel([
          // Translation X with improved easing
          Animated.timing(particle.translateX, {
            toValue: endX,
            duration: 3000, // Longer duration for smoother movement
            easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Custom easing curve
            useNativeDriver: true,
          }),
          // Translation Y with improved easing
          Animated.timing(particle.translateY, {
            toValue: endY,
            duration: 1200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }),
          // Rotation
          Animated.timing(particle.rotate, {
            toValue: rotation,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          // Opacity (first appear, then fade out) with improved timing
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: 0.8,
              duration: 250, // Faster appear
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 950, // Slower fade out
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]);
    });
    
    
    // Start animations and clean up after completion
    resetAnimRef.current.start(() => {
      console.log('Reset animation completed');
      setShowResetAnimation(false);
      
      // Call onGameComplete callback if provided
      if (onGameComplete && typeof onGameComplete === 'function') {
        onGameComplete();
      }
    });
  };
  
  // Play sound effect based on message type
  const playSound = async (type) => {
    console.log(`Playing sound for: ${type}`);
    
    try {
      // Unload previous sound if exists
      if (sound) {
        console.log('Unloading previous sound');
        await sound.unloadAsync();
      }
      
      let soundFile;
      // Set appropriate sound file based on phase
      switch (type) {
        case MESSAGE_TYPES.START_BETTING:
          soundFile = require('../assets/sounds/start_betting.mp3');
          break;
        case MESSAGE_TYPES.STOP_BETTING:
          soundFile = require('../assets/sounds/stop_betting.mp3');
          break;
        case MESSAGE_TYPES.NEW_GAME:
          // Enhanced sound for new game
          soundFile = require('../assets/sounds/buttonClick.mp3');
          break;
        default:
          soundFile = require('../assets/sounds/buttonClick.mp3');
      }
      
      console.log('Loading sound file');
      const { sound: newSound } = await Audio.Sound.createAsync(soundFile, { shouldPlay: true });
      setSound(newSound);
      
      console.log('Sound playing');
      return await newSound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  
  // Get message text based on message type
  const getMessage = () => {
    switch (messageType) {
      case MESSAGE_TYPES.START_BETTING:
        return "Start Betting";
      case MESSAGE_TYPES.STOP_BETTING:
        return "Stop Betting";
      case MESSAGE_TYPES.NEW_GAME:
        return "New Game";
      default:
        return "";
    }
  };
  
  // Generate random particle colors for variety
  const getRandomParticleColor = () => {
    const colors = ['#2F9DFF', '#FFD700', '#FF6347', '#7FFFD4', '#9370DB', '#00FFFF', '#FF00FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // NEW: Generate random shape for large particles
  const getRandomShape = () => {
    const shapes = ['circle', 'square', 'triangle', 'diamond', 'star'];
    return shapes[Math.floor(Math.random() * shapes.length)];
  };
  
  // NEW: Get particle style based on shape
  const getLargeParticleStyle = (shape) => {
    switch (shape) {
      case 'square':
        return { borderRadius: 0 };
      case 'triangle':
        return { 
          width: 0, 
          height: 0, 
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: 10,
          borderRightWidth: 10,
          borderBottomWidth: 20,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
        };
      case 'diamond':
        return { transform: [{ rotate: '45deg' }] };
      case 'star':
        // Simplified star shape
        return { borderRadius: 2 };
      default: // circle
        return { borderRadius: 15 };
    }
  };
  
  return (
    <>
      {/* Full screen animation overlay - NEW */}
      {showFullScreenAnimation && (
        <View style={styles.fullScreenContainer}>
          {/* Background overlay with scale animation */}
          <Animated.View 
            style={[
              styles.fullScreenOverlay,
              {
                opacity: overlayOpacity,
                transform: [{ scale: overlayScale }]
              }
            ]} 
          />
          
          {/* Central burst animation */}
          <Animated.View
            style={[
              styles.burstEffect,
              {
                opacity: burstOpacity,
                transform: [{ scale: burstScale }]
              }
            ]}
          />
          
          {/* Ripple wave effects */}
          <Animated.View
            style={[
              styles.waveCircle,
              {
                opacity: waveAnim1.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 0.6, 0]
                }),
                transform: [{ 
                  scale: waveAnim1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.1, 4]
                  }) 
                }]
              }
            ]}
          />
          
          <Animated.View
            style={[
              styles.waveCircle,
              {
                opacity: waveAnim2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 0.5, 0]
                }),
                transform: [{ 
                  scale: waveAnim2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.1, 3]
                  }) 
                }]
              }
            ]}
          />
          
          <Animated.View
            style={[
              styles.waveCircle,
              {
                opacity: waveAnim3.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 0.4, 0]
                }),
                transform: [{ 
                  scale: waveAnim3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.1, 2]
                  }) 
                }]
              }
            ]}
          />
          
          {/* Large particles */}
          {largeParticleValues.current.map((particle, index) => {
            const shape = getRandomShape();
            return (
              <Animated.View 
                key={`large-particle-${index}`}
                style={[
                  styles.largeParticle,
                  getLargeParticleStyle(shape),
                  {
                    backgroundColor: getRandomParticleColor(),
                    opacity: particle.opacity,
                    transform: [
                      { translateX: particle.translateX },
                      { translateY: particle.translateY },
                      { rotate: particle.rotate.interpolate({
                          inputRange: [0, 360],
                          outputRange: ['0deg', '360deg']
                        })
                      },
                      { scale: particle.scale }
                    ]
                  }
                ]}
              />
            );
          })}
        </View>
      )}
    
      {/* Original container - repositioned to maintain original functionality */}
      <View style={styles.container}>
        {/* Center Message */}
        {showCenterText && (
          <Animated.View style={[
            styles.centerMessageContainer,
            {
              opacity: centerTextOpacity,
              transform: [{ scale: centerTextScale }]
            }
          ]}>
            <Text style={styles.messageText}>
              {getMessage()}
            </Text>
          </Animated.View>
        )}
        
        {/* Reset Animation */}
        {showResetAnimation && (
          <View style={styles.resetAnimationContainer}>
            {/* Main expanding circle */}
            <Animated.View style={[
              styles.resetCircle,
              {
                opacity: resetCircleOpacity,
                transform: [{ scale: resetCircleScale }]
              }
            ]} />
            
            {/* Particles */}
            {particleValues.current.map((particle, index) => (
              <Animated.View 
                key={`particle-${index}`}
                style={[
                  styles.particle,
                  {
                    backgroundColor: getRandomParticleColor(),
                    opacity: particle.opacity,
                    transform: [
                      { translateX: particle.translateX },
                      { translateY: particle.translateY },
                      { rotate: particle.rotate.interpolate({
                          inputRange: [0, 360],
                          outputRange: ['0deg', '360deg']
                        })
                      }
                    ]
                  }
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </>
  );
};

export default PhaseBanner;