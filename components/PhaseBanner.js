import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

// Game phase constants
const PHASES = {
  BETTING: 'betting',    // 0-22s
  RESULT: 'result',      // 22-27s
  RESET: 'reset'         // 27-30s
};

// Get screen dimensions for animations
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Enhanced phase icons with better visual styling
const PhaseIcon = ({ phase }) => {
  // Animation for icon shine effect
  const shineAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Shine animation loop
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  
  // Shine effect
  const shine = shineAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '180deg', '360deg'],
  });
  
  // Get icon based on phase
  const getIcon = () => {
    switch (phase) {
      case PHASES.BETTING:
        return '₹';
      case PHASES.RESULT:
        return '🎲';
      case PHASES.RESET:
        return '🔄';
      default:
        return '💰';
    }
  };
  
  // Get background color based on phase
  const getColor = () => {
    switch (phase) {
      case PHASES.BETTING:
        return 'rgba(255, 255, 255, 0.4)';
      case PHASES.RESULT:
        return 'rgba(255, 255, 255, 0.5)';
      case PHASES.RESET:
        return 'rgba(255, 255, 255, 0.3)';
      default:
        return 'rgba(255, 255, 255, 0.4)';
    }
  };
  
  return (
    <View style={[styles.iconContainer, { backgroundColor: getColor() }]}>
      <Animated.View style={{ transform: [{ rotate: shine }] }}>
        <Text style={styles.icon}>{getIcon()}</Text>
      </Animated.View>
      <Animated.View style={[
        styles.shineOverlay,
        {
          transform: [{ 
            translateX: shineAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 50]
            })
          }]
        }
      ]} />
    </View>
  );
};

const PhaseBanner = ({ phase, gameCompleted }) => {
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Page refresh animation values
  const refreshOpacity = useRef(new Animated.Value(0)).current;
  const refreshScale = useRef(new Animated.Value(1.5)).current;
  const refreshRotation = useRef(new Animated.Value(0)).current;
  
  // Animation references
  const pulseAnimRef = useRef(null);
  const rotateAnimRef = useRef(null);
  const entranceAnimRef = useRef(null);
  const progressAnimRef = useRef(null);
  
  // Progress timer state
  const [progressTimer, setProgressTimer] = useState(null);
  
  // Detect when game is completed for refresh animation
  useEffect(() => {
    if (gameCompleted) {
      runPageRefreshAnimation();
    }
  }, [gameCompleted]);
  
  // Run animations when phase changes
  useEffect(() => {
    // Reset animations
    pulseAnim.setValue(1);
    rotateAnim.setValue(0);
    opacityAnim.setValue(0);
    slideAnim.setValue(100);
    progressAnim.setValue(0);
    
    // Clear any existing timer
    if (progressTimer) {
      clearTimeout(progressTimer);
    }
    
    // Start animations
    startAnimations();
    
    // Start progress bar animation based on phase duration
    startProgressAnimation();
    
    // Cleanup function to stop animations when component unmounts or phase changes
    return () => {
      // Stop animations properly
      if (pulseAnimRef.current) {
        pulseAnimRef.current.stop();
      }
      if (rotateAnimRef.current) {
        rotateAnimRef.current.stop();
      }
      if (entranceAnimRef.current) {
        entranceAnimRef.current.stop();
      }
      if (progressAnimRef.current) {
        progressAnimRef.current.stop();
      }
      if (progressTimer) {
        clearTimeout(progressTimer);
      }
    };
  }, [phase]);
  
  // Progress bar animation based on phase
  const startProgressAnimation = () => {
    // Get duration based on phase
    let duration = 0;
    switch (phase) {
      case PHASES.BETTING:
        duration = 22000; // 22 seconds
        break;
      case PHASES.RESULT:
        duration = 5000; // 5 seconds
        break;
      case PHASES.RESET:
        duration = 3000; // 3 seconds
        break;
      default:
        duration = 22000;
    }
    
    // Animate progress bar
    progressAnimRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration,
      easing: Easing.linear,
      useNativeDriver: false, // width animation needs JS driver
    });
    
    progressAnimRef.current.start();
  };
  
  // Combined animation functions
  const startAnimations = () => {
    // Entrance animation with enhanced spring effect
    entranceAnimRef.current = Animated.parallel([
      // Slide in from right with bounce
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      // Fade in
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]);
    
    entranceAnimRef.current.start(() => {
      // After entrance, start looping animations
      startLoopingAnimations();
    });
  };
  
  const startLoopingAnimations = () => {
    // Enhanced pulsing animation
    pulseAnimRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    
    // Rotation animation for the icon (only for reset phase)
    if (phase === PHASES.RESET) {
      rotateAnimRef.current = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      
      rotateAnimRef.current.start();
    }
    
    pulseAnimRef.current.start();
  };
  
  // Simulate a complete page refresh animation
  const runPageRefreshAnimation = () => {
    // First fade in a full-screen overlay
    Animated.sequence([
      Animated.timing(refreshOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Then spin and scale down
      Animated.parallel([
        Animated.timing(refreshRotation, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(refreshScale, {
          toValue: 0.8,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // Finally fade out
      Animated.timing(refreshOpacity, {
        toValue: 0,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      })
    ]).start();
  };
  
  // Get phase-specific styles
  const getBannerStyle = () => {
    switch (phase) {
      case PHASES.BETTING:
        return styles.bettingBanner;
      case PHASES.RESULT:
        return styles.resultBanner;
      case PHASES.RESET:
        return styles.resetBanner;
      default:
        return styles.bettingBanner;
    }
  };
  
  // Get phase-specific text
  const getBannerText = () => {
    switch (phase) {
      case PHASES.BETTING:
        return "PLACE YOUR BETS";
      case PHASES.RESULT:
        return "RESULTS";
      case PHASES.RESET:
        return "PREPARING NEXT ROUND";
      default:
        return "PLACE YOUR BETS";
    }
  };
  
  // Calculate rotation for the icon
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  // Calculate page refresh rotation
  const pageRefreshSpin = refreshRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  return (
    <>
      {/* Main Phase Banner */}
      <Animated.View style={[
        styles.banner,
        getBannerStyle(),
        { 
          opacity: opacityAnim,
          transform: [
            { scale: pulseAnim },
            { translateX: slideAnim }
          ] 
        }
      ]}>
        {/* Phase Icon with potential rotation animation */}
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <PhaseIcon phase={phase} />
        </Animated.View>
        
        {/* Phase Text */}
        <View style={styles.textContainer}>
          <Text style={styles.bannerText}>{getBannerText()}</Text>
          
          {/* Enhanced Progress Bar */}
          <View style={styles.progressBarContainer}>
            <Animated.View style={[
              styles.progressBar, 
              { 
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]} />
            <View style={styles.progressGlow} />
          </View>
        </View>
      </Animated.View>
      
      {/* Full Page Refresh Animation Overlay */}
      <Animated.View style={[
        styles.refreshOverlay,
        {
          opacity: refreshOpacity,
          transform: [
            { scale: refreshScale },
            { rotate: pageRefreshSpin }
          ]
        }
      ]}>
        <View style={styles.refreshContent}>
          <View style={styles.refreshIconContainer}>
            <Text style={styles.refreshIcon}>🔄</Text>
          </View>
          <Text style={styles.refreshText}>NEW GAME</Text>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 15,
    position: 'absolute',
    top: 20,
    right: 60, // Positioned on the right side
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 12,
    zIndex: 99,
    borderWidth: 2,
    minWidth: 100,
  },
  bettingBanner: {
    backgroundColor: 'rgba(255, 80, 130, 0.85)', // More vibrant pink
    borderColor: '#ff3366',
    borderTopWidth: 1, // Thinner top border for 3D effect
    borderLeftWidth: 1,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  resultBanner: {
    backgroundColor: 'rgba(233, 64, 42, 0.9)', // Yellow for result phase
    borderColor: '#ffa000',
    borderTopWidth: 1,
    borderLeftWidth: 1, 
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  resetBanner: {
    backgroundColor: 'rgba(244, 169, 194, 0.85)', // Different red for reset phase
    borderColor: '#c2185b',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 3, 
    borderBottomWidth: 3,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  bannerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.8,
  },
  iconContainer: {
    width: 34,
    height: 24,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    overflow: 'hidden', // For shine effect
  },
  icon: {
    fontSize: 20,
  },
  shineOverlay: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ rotate: '-45deg' }],
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 3,
    marginTop: 8,
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  // Page refresh animation styles
  refreshOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  refreshContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  refreshIcon: {
    fontSize: 40,
  },
  refreshText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  }
});

export default PhaseBanner;