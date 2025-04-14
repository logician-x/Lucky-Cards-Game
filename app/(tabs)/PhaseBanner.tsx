import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

// Game phase constants - matching those in the parent component
const PHASES = {
  BETTING: 'betting',    // 0-22s
  RESULT: 'result',      // 22-27s
  RESET: 'reset'         // 27-30s
};

// Phase icons to visually represent each phase
const PhaseIcon = ({ phase }) => {
  switch (phase) {
    case PHASES.BETTING:
      return (
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>💰</Text>
        </View>
      );
    case PHASES.RESULT:
      return (
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🎲</Text>
        </View>
      );
    case PHASES.RESET:
      return (
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔄</Text>
        </View>
      );
    default:
      return null;
  }
};

const PhaseBanner = ({ phase }) => {
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  
  // Animation references
  const pulseAnimRef = useRef(null);
  const rotateAnimRef = useRef(null);
  const entranceAnimRef = useRef(null);
  
  // Run animations when phase changes
  useEffect(() => {
    // Reset animations
    pulseAnim.setValue(1);
    rotateAnim.setValue(0);
    opacityAnim.setValue(0);
    slideAnim.setValue(100);
    
    // Start animations
    startAnimations();
    
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
    };
  }, [phase]);
  
  // Combined animation functions
  const startAnimations = () => {
    // Entrance animation
    entranceAnimRef.current = Animated.parallel([
      // Slide in from right
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      // Fade in
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]);
    
    entranceAnimRef.current.start(() => {
      // After entrance, start looping animations
      startLoopingAnimations();
    });
  };
  
  const startLoopingAnimations = () => {
    // Pulsing animation
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
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      
      rotateAnimRef.current.start();
    }
    
    pulseAnimRef.current.start();
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
  
  // Get progress bar width based on phase
  const getProgressWidth = () => {
    switch (phase) {
      case PHASES.BETTING:
        return '80%'; // More time in betting phase
      case PHASES.RESULT:
        return '40%'; // Less time in result phase
      case PHASES.RESET:
        return '20%'; // Very little time in reset phase
      default:
        return '50%';
    }
  };
  
  // Calculate rotation for the icon
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  return (
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
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: getProgressWidth() }]} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    position: 'absolute',
    top: 20,
    right: 80, // Positioned on the right side
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 99,
    borderWidth: 2,
  },
  bettingBanner: {
    backgroundColor: 'rgba(255, 107, 139, 0.9)', // Pink for betting phase
    borderColor: '#ff3366',
  },
  resultBanner: {
    backgroundColor: 'rgba(255, 193, 7, 0.9)', // Yellow for result phase
    borderColor: '#e6a800',
  },
  resetBanner: {
    backgroundColor: 'rgba(255, 75, 92, 0.9)', // Red for reset phase
    borderColor: '#cc0022',
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  bannerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  icon: {
    fontSize: 18,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginTop: 5,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
});

export default PhaseBanner;