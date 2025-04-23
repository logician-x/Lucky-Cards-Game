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
  
  // Animation references
  const centerTextAnimRef = useRef(null);
  
  // Sound reference
  const [sound, setSound] = useState();
  
  // Current message type
  const [messageType, setMessageType] = useState(null);
  // Center text visibility state
  const [showCenterText, setShowCenterText] = useState(false);
  
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
  }, []);
  
  // Clean up sound on component unmount
  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  
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
    
    // Start text animations
    centerTextAnimRef.current = Animated.parallel([
      Animated.timing(centerTextOpacity, {
        toValue: 1,
        duration: 300, // Faster fade-in for 1-second total display
        useNativeDriver: true,
      }),
      Animated.spring(centerTextScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]);
    
    centerTextAnimRef.current.start(() => {
      console.log('Center text animation completed');
    });
    
    // For all messages, show for 1 second as requested
    setTimeout(() => {
      hideMessage();
    }, 1000);
  };
  
  // Hide message with animation
  const hideMessage = () => {
    console.log('Hiding message');
    
    Animated.parallel([
      Animated.timing(centerTextOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(centerTextScale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCenterText(false);
      setMessageType(null);
      console.log('Message hidden');
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
    </View>
  );
};

const styles = StyleSheet.create({
container: {
  marginTop: screenHeight * 0.13,    // 5% of screen height
  marginLeft: screenWidth * 0.3,   
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: [{ translateX: -500 }, { translateY: -50 }], // Half of width and height
  zIndex: 200,
  width: 500, // Large width
  height: 50, // Small height
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
    backgroundColor: 'rgba(0,0,0,0.6)', // Darker overlay to match image
  },
  // Text styling to match the "Stop Betting" in the image
  messageText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2F9DFF', // Blue color like in the image
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
    letterSpacing: 5,
    paddingHorizontal: 20,
    // Additional styling to create the glowing effect seen in the image
    textShadowColor: 'rgba(47, 157, 255, 0.7)', // Matching blue glow
    elevation: 5, // Android elevation for extra effect
    // Title case capitalization to match image
    textTransform: 'none', // We're handling capitalization in the getMessage function
  }
});

export default PhaseBanner;