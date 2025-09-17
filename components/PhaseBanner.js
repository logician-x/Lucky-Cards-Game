import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import {styles} from '../styles/phasebanner.styles';

// Game phase constants
const PHASES = {
  SELECTION: 'selection',  // 0-22s
  RESULT: 'result',        // 22-27s
  RESET: 'reset'           // 27-30s
};

// Phase transition times in seconds
const PHASE_TIMES = {
  SELECTION_START: 0,
  SELECTION_END: 22,
  RESULT_START: 22,
  RESULT_END: 27,
  RESET_START: 27,
  RESET_END: 30
};

// Message types
const MESSAGE_TYPES = {
  START_SELECTION: 'start_selection',
  STOP_SELECTION: 'stop_selection',
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
  const [showCenterText, setShowCenterText] = useState(false);
  const [showResetAnimation, setShowResetAnimation] = useState(false);
  const [showFullScreenAnimation, setShowFullScreenAnimation] = useState(false);
  
  // Previous phase tracking
  const prevPhaseRef = useRef(null);
  const initialMountRef = useRef(true);
  
  // Timer ref for "Stop Selection" early notification
  const stopSelectionTimerRef = useRef(null);
  
  // Initialize Audio
  useEffect(() => {
    const initAudio = async () => {
      try {
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
    
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (stopSelectionTimerRef.current) {
        clearTimeout(stopSelectionTimerRef.current);
      }
    };
  }, []);
  
  // First mount initialization
  useEffect(() => {
    if (phase === PHASES.SELECTION && initialMountRef.current) {
      showMessage(MESSAGE_TYPES.START_SELECTION);
      initialMountRef.current = false;
    }
  }, [phase]);
  
  // Watch for phase changes
  useEffect(() => {
    if (phase && phase !== prevPhaseRef.current) {
      switch (phase) {
        case PHASES.SELECTION:
          if (!initialMountRef.current) {
            showMessage(MESSAGE_TYPES.START_SELECTION);
            
            const timeUntilStopSelection = (PHASE_TIMES.SELECTION_END - PHASE_TIMES.SELECTION_START - 2) * 1000;
            if (stopSelectionTimerRef.current) {
              clearTimeout(stopSelectionTimerRef.current);
            }
            
            stopSelectionTimerRef.current = setTimeout(() => {
              showMessage(MESSAGE_TYPES.STOP_SELECTION);
            }, timeUntilStopSelection);
          }
          break;
        case PHASES.RESULT:
          break;
        case PHASES.RESET:
          showMessage(MESSAGE_TYPES.NEW_GAME);
          playFullScreenAnimation();
          break;
      }
    }
    prevPhaseRef.current = phase;
  }, [phase]);
  
  // Trigger "Stop Selection" based on gameTime
  useEffect(() => {
    if (gameTime && phase === PHASES.SELECTION) {
      const secondsIntoSelection = gameTime - PHASE_TIMES.SELECTION_START;
      if (secondsIntoSelection >= PHASE_TIMES.SELECTION_END - 2 && secondsIntoSelection < PHASE_TIMES.SELECTION_END) {
        if (messageType !== MESSAGE_TYPES.STOP_SELECTION && !showCenterText) {
          showMessage(MESSAGE_TYPES.STOP_SELECTION);
        }
      }
    }
  }, [gameTime, phase]);
  
  // Show message
  const showMessage = async (type) => {
    centerTextOpacity.setValue(0);
    centerTextScale.setValue(0.5);
    
    setMessageType(type);
    await playSound(type);
    setShowCenterText(true);
    
    centerTextAnimRef.current = Animated.parallel([
      Animated.timing(centerTextOpacity, {
        toValue: 1,
        duration: 300, 
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(centerTextScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]);
    
    centerTextAnimRef.current.start();
    
    setTimeout(() => {
      hideMessage();
    }, type === MESSAGE_TYPES.NEW_GAME ? 1500 : 1000);
  };

  // Hide message
  const hideMessage = () => {
    Animated.parallel([
      Animated.timing(centerTextOpacity, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(centerTextScale, {
        toValue: 0.8,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCenterText(false);
      setMessageType(null);
    });
  };
  
  // Play sound effect
  const playSound = async (type) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      let soundFile;
      switch (type) {
        case MESSAGE_TYPES.START_SELECTION:
          soundFile = require('../assets/sounds/start_selection.mp3');
          break;
        case MESSAGE_TYPES.STOP_SELECTION:
          soundFile = require('../assets/sounds/stop_selection.mp3');
          break;
        case MESSAGE_TYPES.NEW_GAME:
          soundFile = require('../assets/sounds/buttonClick.mp3');
          break;
        default:
          soundFile = require('../assets/sounds/buttonClick.mp3');
      }
      const { sound: newSound } = await Audio.Sound.createAsync(soundFile, { shouldPlay: true });
      setSound(newSound);
      return await newSound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  
  // Get message text
  const getMessage = () => {
    switch (messageType) {
      case MESSAGE_TYPES.START_SELECTION:
        return "Start Selecting";
      case MESSAGE_TYPES.STOP_SELECTION:
        return "Stop Selecting";
      case MESSAGE_TYPES.NEW_GAME:
        return "New Game";
      default:
        return "";
    }
  };
  
  return (
    <>
      {/* Full screen animation overlay - unchanged */}
      {showFullScreenAnimation && (
        <View style={styles.fullScreenContainer}>
          {/* ... your animation views stay same ... */}
        </View>
      )}
    
      <View style={styles.container}>
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
        
        {/* Reset animation stays same */}
      </View>
    </>
  );
};

export default PhaseBanner;
