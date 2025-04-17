import { Animated, Dimensions, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

// More precise positions based on screen layout
const winningOptionPosition = {
  x: 400,
  y: 200,
};

const walletPosition = {
  x: 250,
  y: 35,
};

let coinAnimRefs = [];
let particleRefs = [];

// Setup animations with refs - returns initialized animation values
export const setupAnimations = () => {
  const scaleAnim = new Animated.Value(1);
  const winnerScale = new Animated.Value(1);
  const winnerGlow = new Animated.Value(0);
  const confettiOpacity = new Animated.Value(0);
  const resetFade = new Animated.Value(1);
  const shakeAnimation = new Animated.Value(0);
  const pulseOpacity = new Animated.Value(1);
  
  return {
    scaleAnim,
    winnerScale,
    winnerGlow,
    confettiOpacity, 
    resetFade,
    shakeAnimation,
    pulseOpacity
  };
};

// Enhanced coin animation with better physics and shine effect
export const animateCoinsToWallet = () => {
  const NUM_COINS = 15; // More coins for visual impact
  
  // Clear any previous animations
  coinAnimRefs = [];
  
  // Clean up any existing particles
  particleRefs.forEach(p => {
    if (p && p.opacity) {
      Animated.timing(p.opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      }).start();
    }
  });
  
  // Reset particles array after fade out
  setTimeout(() => {
    particleRefs = [];
  }, 150);

  // Create glitter/shine effect at winning position
  createShineEffect(winningOptionPosition.x, winningOptionPosition.y);

  for (let i = 0; i < NUM_COINS; i++) {
    // Random starting positions within a small area around the winning option
    const randomOffsetX = Math.random() * 40 - 20;
    const randomOffsetY = Math.random() * 40 - 20;
    
    const x = new Animated.Value(winningOptionPosition.x + randomOffsetX);
    const y = new Animated.Value(winningOptionPosition.y + randomOffsetY);
    const opacity = new Animated.Value(0); // Start invisible
    const scale = new Animated.Value(0.5);
    const rotation = new Animated.Value(0);
    
    coinAnimRefs.push({ x, y, opacity, scale, rotation });

    // Duration calculation based on distance
    const distance = Math.sqrt(
      Math.pow(walletPosition.x - (winningOptionPosition.x + randomOffsetX), 2) + 
      Math.pow(walletPosition.y - (winningOptionPosition.y + randomOffsetY), 2)
    );
    const baseDuration = 800;
    const duration = baseDuration + (distance / 5);
    
    // Path config for coin trajectory
    const midX = winningOptionPosition.x + (walletPosition.x - winningOptionPosition.x) * 0.5;
    const midY = winningOptionPosition.y + (walletPosition.y - winningOptionPosition.y) * 0.3;
    const controlX = midX + (Math.random() * 80 - 40);
    const controlY = midY + (Math.random() * 60 - 30);

    // Coin appears with a small 'pop' effect
    Animated.sequence([
      Animated.delay(i * 70), // Staggered start for each coin
      
      // Appearance animation
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 140,
          useNativeDriver: true,
        }),
      ]),
      
      // Move and rotate animation
      Animated.parallel([
        // X position animation
        Animated.timing(x, {
          toValue: walletPosition.x,
          duration: duration,
          easing: Easing.bezier(0.2, 0.65, 0.4, 0.95),
          useNativeDriver: true,
        }),
        
        // Y position animation with custom curve
        Animated.timing(y, {
          toValue: walletPosition.y,
          duration: duration,
          easing: Easing.bezier(0.2, 0.65, 0.4, 0.95),
          useNativeDriver: true,
        }),
        
        // Coin spins as it flies
        Animated.timing(rotation, {
          toValue: 4 + Math.random() * 4, // Random number of full rotations
          duration: duration,
          easing: Easing.bezier(0.2, 0.5, 0.8, 1),
          useNativeDriver: true,
        }),
        
        // Coin shrinks as it reaches the wallet
        Animated.timing(scale, {
          toValue: 0.2,
          duration: duration,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
        
        // Coin fades as it reaches the wallet
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration,
          // Only start fading halfway through animation
          delay: duration * 0.6,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Once the last coin animation is complete, add a little 'shine' to the wallet
      if (i === NUM_COINS - 1) {
        createWalletShineEffect();
      }
    });
  }
  
  // Return true to indicate animation has started
  return true;
};

// Create shine/sparkle effect around the wallet when coins arrive
const createWalletShineEffect = () => {
  const NUM_PARTICLES = 8;
  
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const angle = (i / NUM_PARTICLES) * Math.PI * 2;
    const distance = 30;
    
    const x = new Animated.Value(walletPosition.x);
    const y = new Animated.Value(walletPosition.y);
    const opacity = new Animated.Value(0);
    const scale = new Animated.Value(0.5);
    
    particleRefs.push({ x, y, opacity, scale });
    
    Animated.sequence([
      Animated.parallel([
        Animated.timing(x, {
          toValue: walletPosition.x + Math.cos(angle) * distance,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: walletPosition.y + Math.sin(angle) * distance,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }
};

// Create shine effect at winning position
const createShineEffect = (x, y) => {
  const NUM_PARTICLES = 12;
  
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const angle = (i / NUM_PARTICLES) * Math.PI * 2;
    const distance = 50 + Math.random() * 30;
    
    const particleX = new Animated.Value(x);
    const particleY = new Animated.Value(y);
    const opacity = new Animated.Value(0);
    const scale = new Animated.Value(0.2);
    
    particleRefs.push({ x: particleX, y: particleY, opacity, scale });
    
    Animated.sequence([
      Animated.parallel([
        Animated.timing(particleX, {
          toValue: x + Math.cos(angle) * distance,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(particleY, {
          toValue: y + Math.sin(angle) * distance,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8 + Math.random() * 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }
};

// Render coin animations
export const renderCoinAnimations = () => {
  return (
    <>
      {particleRefs.map((particle, index) => {
        if (!particle || !particle.x || !particle.y || !particle.opacity) {
          return null;
        }
        return (
          <Animated.Image
            key={`particle-${index}`}
            source={require('../assets/images/shine.png')}
            style={{
              width: 15,
              height: 15,
              position: 'absolute',
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale || new Animated.Value(1) },
              ],
              opacity: particle.opacity,
              zIndex: 999,
            }}
          />
        );
      })}
      
      {coinAnimRefs.map((coin, index) => {
        if (!coin || !coin.x || !coin.y || !coin.opacity) {
          return null;
        }
        return (
          <Animated.Image
            key={`coin-${index}`}
            source={require('../assets/images/coin1.png')}
            style={{
              width: 30,
              height: 30,
              position: 'absolute',
              transform: [
                { translateX: coin.x },
                { translateY: coin.y },
                { scale: coin.scale || new Animated.Value(1) },
                { rotateY: coin.rotation ? coin.rotation.interpolate({
                  inputRange: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                  outputRange: ['0deg', '180deg', '360deg', '540deg', '720deg', '900deg', '1080deg', '1260deg', '1440deg']
                }) : '0deg' },
              ],
              opacity: coin.opacity,
              zIndex: 1000,
            }}
          />
        );
      })}
    </>
  );
};

// Enhanced timer pulse animation
export const startTimerPulse = (scaleAnim, pulseOpacity) => {
  if (!scaleAnim) {
    console.warn("Warning: scaleAnim is undefined in startTimerPulse");
    return null;
  }
  
  let animationLoop = null;
  
  try {
    animationLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.15,
            duration: 600,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }),
          pulseOpacity ? Animated.timing(pulseOpacity, {
            toValue: 0.8,
            duration: 600,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }) : null,
        ].filter(Boolean)), // Filter out any null animations
        
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }),
          pulseOpacity ? Animated.timing(pulseOpacity, {
            toValue: 1,
            duration: 600,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }) : null,
        ].filter(Boolean)), // Filter out any null animations
      ])
    );

    animationLoop.start();
  } catch (error) {
    console.warn("Error in startTimerPulse:", error);
  }
  
  return animationLoop;
};

// Dramatically enhanced winner animation
export const animateWinner = (winnerScale, winnerGlow, confettiOpacity, shakeAnimation) => {
  // Guard against undefined animation values
  if (!winnerScale) {
    console.warn("Warning: winnerScale is undefined in animateWinner");
    return;
  }
  
  // Create a safe animation function that checks parameters
  const safeAnimateValue = (animValue, config) => {
    if (!animValue) return null;
    return Animated.timing(animValue, config);
  };
  
  try {
    // Multi-step animation sequence for winning option
    Animated.sequence([
      // Initial excitement - quick intense pulse
      Animated.parallel([
        Animated.sequence([
          safeAnimateValue(winnerScale, {
            toValue: 1.3,
            duration: 200,
            easing: Easing.bezier(0.13, 0.67, 0.24, 0.99),
            useNativeDriver: true,
          }),
          safeAnimateValue(winnerScale, {
            toValue: 1.1,
            duration: 150,
            easing: Easing.bezier(0.5, 0, 0.5, 1),
            useNativeDriver: true,
          }),
        ].filter(Boolean)),
        
        // Glow appears if available
        winnerGlow ? safeAnimateValue(winnerGlow, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }) : null,
      ].filter(Boolean)),
      
      // Celebratory shake animation if available
      shakeAnimation ? Animated.sequence([
        safeAnimateValue(shakeAnimation, {
          toValue: 1,
          duration: 100,
          easing: Easing.bezier(0.36, 0.07, 0.19, 0.97),
          useNativeDriver: true,
        }),
        safeAnimateValue(shakeAnimation, {
          toValue: -1,
          duration: 100,
          easing: Easing.bezier(0.36, 0.07, 0.19, 0.97),
          useNativeDriver: true,
        }),
        safeAnimateValue(shakeAnimation, {
          toValue: 0.7,
          duration: 100,
          easing: Easing.bezier(0.36, 0.07, 0.19, 0.97),
          useNativeDriver: true,
        }),
        safeAnimateValue(shakeAnimation, {
          toValue: -0.7,
          duration: 100,
          easing: Easing.bezier(0.36, 0.07, 0.19, 0.97),
          useNativeDriver: true,
        }),
        safeAnimateValue(shakeAnimation, {
          toValue: 0,
          duration: 100,
          easing: Easing.bezier(0.36, 0.07, 0.19, 0.97),
          useNativeDriver: true,
        }),
      ].filter(Boolean)) : null,
      
      // Sustained celebration - gentler pulses
      winnerScale ? Animated.sequence([
        safeAnimateValue(winnerScale, {
          toValue: 1.15,
          duration: 400,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        safeAnimateValue(winnerScale, {
          toValue: 1.05,
          duration: 400,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        safeAnimateValue(winnerScale, {
          toValue: 1.1,
          duration: 400,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        safeAnimateValue(winnerScale, {
          toValue: 1,
          duration: 300,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ].filter(Boolean)) : null,
    ].filter(Boolean)).start();
    
    // Confetti animation with long-lasting presence if available
    if (confettiOpacity) {
      Animated.sequence([
        safeAnimateValue(confettiOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000), // Keep confetti visible longer
        safeAnimateValue(confettiOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      ].filter(Boolean)).start();
    }
    
    // After a delay, fade out the winner glow if available
    if (winnerGlow) {
      Animated.sequence([
        Animated.delay(3500),
        safeAnimateValue(winnerGlow, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ].filter(Boolean)).start();
    }
  } catch (error) {
    console.warn("Error in animateWinner:", error);
  }
};

// Enhanced option highlighting animation - more like a roulette/slot machine

export const animateHighlightAcrossOptions = (setHighlightedIndex, winnerIndex, onComplete) => {
  if (typeof setHighlightedIndex !== 'function') {
    console.warn("Warning: setHighlightedIndex is not a function in animateHighlightAcrossOptions");
    return;
  }
  
  try {
    const totalOptions = 12;
    const totalAnimationTime = 3000; // 4 seconds in milliseconds
    
    // Parameters for animation pacing
    const initialDelay = 120; // Start with moderate speed
    const minDelay = 40;      // Fastest animation speed
    const finalDelay = 200;   // Slow to a stop
    
    // Define animation phases (proportions of total time)
    const accelerationProportion = 0.25; // First 25% of time
    const steadyProportion = 0.35;       // Next 35% of time
    const decelerationProportion = 0.4;  // Final 40% of time
    
    let startTime = null;
    let currentIndex = 0;
    let lastUpdateTime = 0;
    
    const runHighlight = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      
      if (elapsedTime >= totalAnimationTime) {
        // Animation complete - ensure we end on winner
        setHighlightedIndex(winnerIndex);
        
        if (onComplete && typeof onComplete === 'function') {
          setTimeout(onComplete, 100);
        }
        return;
      }
      
      // Calculate progress through animation (0 to 1)
      const progress = elapsedTime / totalAnimationTime;
      let currentDelay;
      
      if (progress < accelerationProportion) {
        // Acceleration phase
        const phaseProgress = progress / accelerationProportion;
        currentDelay = initialDelay - (initialDelay - minDelay) * Math.pow(phaseProgress, 2);
      } else if (progress < accelerationProportion + steadyProportion) {
        // Steady phase
        currentDelay = minDelay;
      } else {
        // Deceleration phase
        const phaseProgress = (progress - accelerationProportion - steadyProportion) / decelerationProportion;
        currentDelay = minDelay + (finalDelay - minDelay) * Math.pow(phaseProgress, 2);
      }
      
      // Check if enough time has passed since last update based on current delay
      if (timestamp - lastUpdateTime >= currentDelay) {
        // Calculate the correct position dynamically
        if (progress > 0.85) {
          // In final phase, ensure we're approaching the winner
          const remainingSteps = Math.max(1, Math.round((totalAnimationTime - elapsedTime) / currentDelay));
          const stepsToWinner = (totalOptions + winnerIndex - currentIndex % totalOptions) % totalOptions;
          
          // Adjust the index to ensure we end on winner
          if (remainingSteps <= stepsToWinner) {
            currentIndex = (winnerIndex - remainingSteps + totalOptions) % totalOptions;
          }
        }
        
        // Update highlighted index
        const indexToHighlight = currentIndex % totalOptions;
        setHighlightedIndex(indexToHighlight);
        currentIndex++;
        lastUpdateTime = timestamp;
      }
      
      // Continue animation
      requestAnimationFrame(runHighlight);
    };
    
    // Start the animation process using requestAnimationFrame for smoother timing
    requestAnimationFrame(runHighlight);
  } catch (error) {
    console.warn("Error in animateHighlightAcrossOptions:", error);
  }
};

// Enhanced reset animation
export const animateReset = (resetFade, shakeAnimation) => {
  // Guard against undefined animation values
  if (!resetFade) {
    console.warn("Warning: resetFade is undefined in animateReset");
    return;
  }
  
  try {
    const animations = [];
    
    // Fade animation
    animations.push(Animated.timing(resetFade, {
      toValue: 0.4,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }));
    
    // Add shake animation if available
    if (shakeAnimation) {
      animations.push(Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 2,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -2,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
      ]));
    }
    
    Animated.sequence([
      Animated.parallel(animations),
      Animated.timing(resetFade, {
        toValue: 1,
        duration: 400,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
        useNativeDriver: true,
      }),
    ]).start();
  } catch (error) {
    console.warn("Error in animateReset:", error);
  }
};

// New animation for coin placement with bounce effect
export const animateCoinPlacement = (itemRef, optionPosition) => {
  if (!itemRef || !itemRef.current) {
    console.warn("Warning: itemRef is undefined or has no current property in animateCoinPlacement");
    return null;
  }
  
  try {
    // Create animated values for the coin
    const coinY = new Animated.Value(-50); // Start above the option
    const coinScale = new Animated.Value(0.5);
    const coinRotation = new Animated.Value(0);
    const coinOpacity = new Animated.Value(1);
    
    // Attach these animated values to the ref
    itemRef.current.coinY = coinY;
    itemRef.current.coinScale = coinScale;
    itemRef.current.coinRotation = coinRotation;
    itemRef.current.coinOpacity = coinOpacity;
    
    // Define the coin drop animation
    Animated.sequence([
      // Coin appears and spins while dropping
      Animated.parallel([
        Animated.timing(coinY, {
          toValue: 0, // Land on the option
          duration: 600,
          easing: Easing.bounce, // Bounce when landing
          useNativeDriver: true,
        }),
        Animated.timing(coinScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(coinRotation, {
          toValue: 2, // Two full rotations
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Gentle settling motion
      Animated.spring(coinY, {
        toValue: -2, // Slightly above resting position
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Return the animation handlers that can be used in your render method
    return {
      coinY,
      coinScale,
      coinRotation,
    };
  } catch (error) {
    console.warn("Error in animateCoinPlacement:", error);
    return null;
  }
};

// Render placed betting coins on options
export const renderPlacedCoins = (bettingRefs) => {
  if (!bettingRefs || !Array.isArray(bettingRefs)) {
    return null;
  }
  
  return bettingRefs.map((ref, index) => {
    if (!ref || !ref.current || !ref.current.coinY) return null;
    
    try {
      return (
        <Animated.Image
          key={`placed-coin-${index}`}
          source={require('../assets/images/coin1.png')}
          style={{
            width: 25,
            height: 25,
            position: 'absolute',
            left: (ref.current.layout && ref.current.layout.x + 15) || 0, // Center on option
            top: (ref.current.layout && ref.current.layout.y - 10) || 0,  // Place on top of option
            transform: [
              { translateY: ref.current.coinY },
              { scale: ref.current.coinScale },
              { rotateY: ref.current.coinRotation.interpolate({
                inputRange: [0, 1, 2],
                outputRange: ['0deg', '360deg', '720deg']
              })},
            ],
            opacity: ref.current.coinOpacity,
            zIndex: 50,
          }}
        />
      );
    } catch (error) {
      console.warn(`Error rendering placed coin at index ${index}:`, error);
      return null;
    }
  }).filter(Boolean); // Filter out any null elements
};

// Add gleaming/shimmering effect to coins or betting options
export const addGlimmerEffect = (position, containerRef) => {
  if (!containerRef || !containerRef.current) {
    console.warn("Warning: containerRef is undefined or has no current property in addGlimmerEffect");
    return null;
  }
  
  try {
    const shimmerOpacity = new Animated.Value(0);
    const shimmerPosition = new Animated.Value(0);
    
    containerRef.current.shimmerOpacity = shimmerOpacity;
    containerRef.current.shimmerPosition = shimmerPosition;
    
    // Gleaming animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerOpacity, {
          toValue: 0.7,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerPosition, {
          toValue: 1, // Move across the element
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerPosition, {
          toValue: 0, // Reset position
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(2000), // Wait before next shimmer
      ])
    ).start();
    
    return {
      shimmerOpacity,
      shimmerPosition,
    };
  } catch (error) {
    console.warn("Error in addGlimmerEffect:", error);
    return null;
  }
};