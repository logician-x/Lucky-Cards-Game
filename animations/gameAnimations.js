import { Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// You can adjust these as needed
const winningOptionPosition = {
  x: 400,
  y: 200,
};

const walletPosition = {
  x: 250,
  y: 35,
};

let coinAnimRefs = [];

export const animateCoinsToWallet = () => {
  const NUM_COINS = 10;
  coinAnimRefs = [];

  for (let i = 0; i < NUM_COINS; i++) {
    const x = new Animated.Value(winningOptionPosition.x);
    const y = new Animated.Value(winningOptionPosition.y);
    const opacity = new Animated.Value(1);
    
    coinAnimRefs.push({ x, y, opacity });

    Animated.sequence([
      Animated.delay(i * 120), // stagger each coin
      Animated.parallel([
        Animated.timing(x, {
          toValue: walletPosition.x,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: walletPosition.y,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }
};

export const renderCoinAnimations = () => {
  return coinAnimRefs.map((coin, index) => (
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
        ],
        opacity: coin.opacity,
        zIndex: 1000,
      }}
    />
  ));
};


// Setup animations with refs
export const setupAnimations = () => {
  const scaleAnim = new Animated.Value(1);
  const winnerScale = new Animated.Value(1);
  const confettiOpacity = new Animated.Value(0);
  const resetFade = new Animated.Value(1);

  return {
    scaleAnim,
    winnerScale,
    confettiOpacity,
    resetFade
  };
};

// Timer pulse animation
export const startTimerPulse = (scaleAnim) => {
  const animationLoop = Animated.loop(
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ])
  );

  animationLoop.start();
  return animationLoop;
};

// Winner animation
export const animateWinner = (winnerScale, confettiOpacity) => {
  // Scale animation for winner
  Animated.sequence([
    Animated.timing(winnerScale, {
      toValue: 1.2,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(winnerScale, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(winnerScale, {
      toValue: 1.2,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(winnerScale, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    })
  ]).start();
  
  // Confetti animation
  Animated.sequence([
    Animated.timing(confettiOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.delay(2000),
    Animated.timing(confettiOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    })
  ]).start();
};

export const animateHighlightAcrossOptions = (setHighlightedIndex, winnerIndex, onComplete) => {
  const totalOptions = 12;
  const fullCycles = 2; // Loop over all options twice
  const totalSteps = fullCycles * totalOptions + winnerIndex;
  
  let currentIndex = 0;

  const interval = setInterval(() => {
    const indexToHighlight = currentIndex % totalOptions;
    setHighlightedIndex(indexToHighlight);
    currentIndex++;

    if (currentIndex > totalSteps) {
      clearInterval(interval);
      setTimeout(() => {
        onComplete && onComplete();
      }, 500);
    }
  }, 60); // Speed of highlight (ms)
};



// Reset phase animation
export const animateReset = (resetFade) => {
  Animated.sequence([
    Animated.timing(resetFade, {
      toValue: 0.5,
      duration: 500,
      useNativeDriver: true,
    }),
    Animated.timing(resetFade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    })
  ]).start();
};




// Animate coin placement
export const animateCoinPlacement = (index) => {
  // In a real implementation, this would animate a coin dropping onto the selected option
  console.log(`Placing coin on option ${index}`);
};