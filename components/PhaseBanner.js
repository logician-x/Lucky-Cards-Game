import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
  
  // Fix: Properly initialize particleValues with array of animation values
  const particleValues = useRef([]);
  
  // Initialize particle animations on first render
  useEffect(() => {
    particleValues.current = Array(12).fill().map(() => ({
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      rotate: new Animated.Value(0),
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
  
  // Previous phase tracking
  const prevPhaseRef = useRef(null);
  // Flag to track initial component mount
  const initialMountRef = useRef(true);
  
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
          }
          break;
        case PHASES.RESULT:
          // Show STOP_BETTING message when entering result phase
          console.log('Phase changed to result, showing STOP_BETTING');
          showMessage(MESSAGE_TYPES.STOP_BETTING);
          break;
        case PHASES.RESET:
          // Show NEW_GAME message when entering reset phase
          console.log('Phase changed to reset, showing NEW_GAME');
          showMessage(MESSAGE_TYPES.NEW_GAME);
          // Start the reset animation
          playResetAnimation();
          break;
      }
    }
    
    // Update previous phase reference
    prevPhaseRef.current = phase;
  }, [phase]);
  
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
    
    // Show message for 1 second
    setTimeout(() => {
      hideMessage();
    }, 1000);
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
  
  // Play reset phase animation
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
    
    // Create main circle expansion animation with improved timing
    const circleExpansion = Animated.sequence([
      Animated.timing(resetCircleScale, {
        toValue: 1,
        duration: 3000, // Slightly longer for smoother expansion
        easing: Easing.bezier(0.16, 1, 0.3, 1), // Custom bezier curve for more natural animation
        useNativeDriver: true,
      }),
      Animated.timing(resetCircleOpacity, {
        toValue: 0,
        duration: 500, // Longer fade for smoother transition
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
    
    // Run all animations in parallel
    resetAnimRef.current = Animated.parallel([
      circleExpansion,
      ...particleAnimations,
    ]);
    
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
    const colors = ['#2F9DFF', '#FFD700', '#FF6347', '#7FFFD4', '#9370DB'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: screenHeight * 0.13,
    marginLeft: screenWidth * 0.3,   
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -500 }, { translateY: -50 }],
    zIndex: 200,
    width: 500,
    height: 50,
  },
  
  // Center message styles
  centerMessageContainer: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    pointerEvents: 'none',
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12, // Added for smoother appearance
  },
  messageText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2F9DFF',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
    letterSpacing: 5,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(47, 157, 255, 0.7)',
    elevation: 5,
    textTransform: 'none',
  },
  
  // Reset animation styles
  resetAnimationContainer: {
    position: 'absolute',
    top: 150,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 190,
    pointerEvents: 'none',
  },
  resetCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(47, 157, 255, 0.2)',
    borderWidth: 4,
    borderColor: '#2F9DFF',
    shadowColor: '#2F9DFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  particle: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 8,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default PhaseBanner;