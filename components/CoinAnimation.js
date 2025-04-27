// CoinAnimation.js
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Image, Text, Dimensions, Animated, Easing, Platform } from 'react-native';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

// Define the positions of all 12 items - memoized to prevent recalculation
const getLayouts = () => [
  // Row 1 (top row)
  { x: width * 0.25, y: height * 0.38 },  // Umbrella
  { x: width * 0.37, y: height * 0.38 },  // Football
  { x: width * 0.47, y: height * 0.38 },  // Sun
  { x: width * 0.57, y: height * 0.38 },  // Diya/Lamp
  { x: width * 0.70, y: height * 0.38 },  // Cow
  { x: width * 0.83, y: height * 0.38 },  // Bucket
  // Row 2 (bottom row)
  { x: width * 0.25, y: height * 0.6 },   // Kite
  { x: width * 0.37, y: height * 0.6 },   // Lantern
  { x: width * 0.47, y: height * 0.6 },   // Rose
  { x: width * 0.57, y: height * 0.6 },   // Butterfly
  { x: width * 0.70, y: height * 0.6 },   // Crow
  { x: width * 0.83, y: height * 0.6 },   // Rabbit
];

// Source position (left side center)
const sourcePosition = { x: width * 0.08, y: height * 0.5 };

// Animation config for better performance
const animationConfig = {
  useNativeDriver: true,
  isInteraction: false // Reduces interaction tracking overhead
};

const CoinAnimation = ({ coinImage, sourceImage, gamePhase }) => {
  // Memoize layouts to prevent recalculations
  const layouts = useMemo(() => getLayouts(), []);
  
  // State for random amount that changes every 2 seconds
  const [randomAmount, setRandomAmount] = useState(Math.floor(Math.random() * 4501) + 500);
  
  // Ref to store all active coin animations
  const coinAnimations = useRef([]);
  
  // Store completed animations that have reached their targets
  // Track coins by target position index instead of a flat array
  const [placedCoins, setPlacedCoins] = useState(Array(layouts.length).fill().map(() => []));
  
  // Throttle coin creation to avoid too many coins
  const coinThrottleRef = useRef(0);
  
  // Limit maximum coins for better performance
  const MAX_ACTIVE_COINS = Platform.OS === 'ios' ? 40 : 30;
  // Limit coins per target position instead of global limit
  const MAX_COINS_PER_TARGET = Platform.OS === 'ios' ? 15 : 10;
  
  // Pre-loaded coin image for performance
  const defaultCoinImage = useMemo(() => coinImage || require('../assets/images/coin1.png'), [coinImage]);
  
  // Ref for audio
  const soundRef = useRef(null);
  
  // Update random amount every 2 seconds
  useEffect(() => {
    const amountInterval = setInterval(() => {
      setRandomAmount(Math.floor(Math.random() * 4501) + 500);
    }, 2000);
    
    return () => clearInterval(amountInterval);
  }, []);
  
  // Load coin sound effect
  useEffect(() => {
    let isMounted = true;
    
    const loadSound = async () => {
      try {
        if (!isMounted) return;
        
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/coin_fly.mp3'),
          { volume: 0.7 } // Slightly reduce volume for less audio processing
        );
        
        if (isMounted) {
          soundRef.current = sound;
        }
      } catch (error) {
        console.error("Failed to load coin sound:", error);
      }
    };
    
    loadSound();
    
    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);
  
  // Function to play coin sound with debouncing
  const lastSoundPlayedAt = useRef(0);
  const playCoinSound = async () => {
    try {
      // Only play sound during betting phase
      if (gamePhase !== 'betting') return;
      
      // Debounce sound playing to avoid audio stuttering
      const now = Date.now();
      if (now - lastSoundPlayedAt.current < 150) return;
      
      lastSoundPlayedAt.current = now;
      
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (error) {
      // Silently fail if sound fails - don't impact performance
    }
  };
  
  // Add slight random offset to target positions for more natural stacking
  const getTargetWithOffset = (target) => {
    const offsetRange = 8; // Maximum pixel offset
    return {
      x: target.x + (Math.random() * offsetRange - offsetRange/2),
      y: target.y + (Math.random() * offsetRange - offsetRange/2)
    };
  };
  
  // Create a new coin animation with optimized settings
  const createCoin = () => {
    // Only create coins during betting phase
    if (gamePhase !== 'betting') return;
    
    // Throttle coin creation
    const now = Date.now();
    if (now - coinThrottleRef.current < 50) return;
    coinThrottleRef.current = now;
    
    // Limit active coins for performance
    if (coinAnimations.current.length >= MAX_ACTIVE_COINS) return;
    
    // Play sound when creating a coin
    playCoinSound();
    
    // Create animated values for position
    const posX = new Animated.Value(sourcePosition.x);
    const posY = new Animated.Value(sourcePosition.y);
    const scale = new Animated.Value(0.8);
    
    // Pick a random target position from layouts
    const targetIndex = Math.floor(Math.random() * layouts.length);
    const baseTarget = layouts[targetIndex];
    
    // Check if we've reached the limit for this target position
    if (placedCoins[targetIndex].length >= MAX_COINS_PER_TARGET) {
      // Skip this position and try another one
      return;
    }
    
    // Add slight offset for visual stacking
    const target = getTargetWithOffset(baseTarget);
    
    // Create a unique ID for this coin
    const id = `coin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    // Add to animations array
    coinAnimations.current.push({
      id,
      posX,
      posY,
      scale,
      targetIndex,
      target,
    });
    
    // Smoother duration variations
    const baseDuration = 1400;
    const durationVariation = Math.random() * 600;
    const duration = baseDuration + durationVariation;
    
    // Use bezier curve for more natural motion
    const bezierCurve = Easing.bezier(0.25, 0.46, 0.45, 0.94);
    
    // Optimize animation for performance
    Animated.parallel([
      Animated.timing(posX, {
        toValue: target.x,
        duration,
        easing: bezierCurve,
        ...animationConfig
      }),
      Animated.timing(posY, {
        toValue: target.y,
        duration,
        easing: bezierCurve,
        ...animationConfig
      }),
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1,
          duration: 150,
          ...animationConfig
        }),
        Animated.timing(scale, {
          toValue: 0.6,
          duration: duration - 150,
          ...animationConfig
        })
      ])
    ]).start(() => {
      // When coin reaches its target, add it to placed coins
      // and remove from active animations
      setPlacedCoins(prev => {
        const newPlacedCoins = [...prev];
        // Add this coin to the appropriate target array
        newPlacedCoins[targetIndex] = [
          ...newPlacedCoins[targetIndex],
          { id, x: target.x, y: target.y }
        ].slice(-MAX_COINS_PER_TARGET); // Keep only the latest MAX_COINS_PER_TARGET coins
        return newPlacedCoins;
      });
      
      // Clean up finished animation
      coinAnimations.current = coinAnimations.current.filter(coin => coin.id !== id);
    });
  };
  
  // Handle phase changes efficiently
  useEffect(() => {
    // If game phase changes to "reset", clear all placed coins
    if (gamePhase === 'reset') {
      setPlacedCoins(Array(layouts.length).fill().map(() => []));
    }
  }, [gamePhase, layouts.length]);
  
  // Start creating coins at regular intervals during betting phase
  useEffect(() => {
    let interval;
    
    if (gamePhase === 'betting') {
      // Create initial batch of coins in staggered manner for smoothness
      for (let i = 0; i < 8; i++) {
        setTimeout(() => createCoin(), i * 100);
      }
      
      // Set up interval to continuously create new coins during betting phase
      interval = setInterval(() => {
        createCoin();
      }, 180); // Slightly more spaced out for smoother performance
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gamePhase]);
  
  // Memoize placed coin images to prevent unnecessary rerenders
  const placedCoinImages = useMemo(() => {
    // Only show coins during betting and result phases
    if (gamePhase !== 'betting' && gamePhase !== 'result') return null;
    
    // Flatten the placedCoins array for rendering
    return placedCoins.flatMap((targetCoins, index) => 
      targetCoins.map((coin) => (
        <Image
          key={coin.id}
          source={defaultCoinImage}
          style={{
            position: 'absolute',
            width: 12,
            height: 12,
            left: coin.x - 6,
            top: coin.y - 6,
          }}
        />
      ))
    );
  }, [placedCoins, gamePhase, defaultCoinImage]);
  
  return (
    <View style={{ position: 'absolute', width, height, pointerEvents: 'none' }}>
      {/* Source image on the left side - always visible */}
      <View style={{ 
        position: 'absolute', 
        left: sourcePosition.x - 30, 
        top: sourcePosition.y - 30,
        alignItems: 'center'
      }}>
        <Image 
          source={sourceImage || require('../assets/images/avtar.png')} 
          style={{ width: 60, height: 60 }}
          resizeMode="contain"
        />
        <Text style={{ 
          marginTop: 5, 
          color: '#FFD700', 
          fontWeight: 'bold',
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: {width: 1, height: 1},
          textShadowRadius: 2,
          fontSize: 16
        }}>
          🟢{randomAmount}
        </Text>
      </View>
      
      {/* Render all active coin animations */}
      {coinAnimations.current.map((coin) => (
        <Animated.Image
          key={coin.id}
          source={defaultCoinImage}
          style={{
            position: 'absolute',
            width: 20,
            height: 20,
            transform: [
              { translateX: coin.posX },
              { translateY: coin.posY },
              { scale: coin.scale }
            ],
          }}
        />
      ))}
      
      {/* Render all placed coins that have reached their destination */}
      {placedCoinImages}
    </View>
  );
};

export default React.memo(CoinAnimation);