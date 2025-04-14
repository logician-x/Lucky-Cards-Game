import React, { useState, useEffect, useRef } from 'react';
import { 
  ImageBackground, StyleSheet, View, Animated, 
  Text, Image, TouchableOpacity, StatusBar, Dimensions,
  findNodeHandle, UIManager, Alert 
} from 'react-native';
import PhaseBanner from './PhaseBanner';
import { styles } from '../../styles/gamescreen.styles';
// Image imports
import umbrella from '../../assets/images/umbrella.jpg';
import football from '../../assets/images/football.jpeg';
import sun from '../../assets/images/sun.jpeg';
import diva from '../../assets/images/Diva.jpg';
import ki from '../../assets/images/ki.png';
import top from '../../assets/images/top.jpg';
import rose from '../../assets/images/rose.jpg';
import butterfly from '../../assets/images/Butterfly.jpg';
import cow from '../../assets/images/cow.jpg';
import bucket from '../../assets/images/bucket.jpeg';
import crow from '../../assets/images/crow.jpg';
import rabbit from '../../assets/images/rabbit.jpg';
import coin from '../../assets/images/coin.png';
import coin1 from '../../assets/images/coin1.png';


// Item images array
const itemImages = [
  umbrella, football, sun, diva, ki, top,
  rose, butterfly, cow, bucket, crow, rabbit
];

// Item names for better reference
const itemNames = [
  'Umbrella', 'Football', 'Sun', 'Diya', 'Kite', 'Top',
  'Rose', 'Butterfly', 'Cow', 'Bucket', 'Crow', 'Rabbit'
];

// Coin images - separate images for each denomination
const coinImages = {
  5: coin,
  10: coin,
  20: coin,
  30: coin,
  70: coin,
  100: coin,
};

// Game phase constants
const PHASES = {
  BETTING: 'betting',    // 0-22s
  RESULT: 'result',      // 22-27s
  RESET: 'reset'         // 27-30s
};

// Generic placed bet coin image (visible to all users)
const publicCoinImage = coin1;

export default function App() {
  const [walletBalance, setWalletBalance] = useState(1000);
  const [selectedChip, setSelectedChip] = useState(10);
  const [bets, setBets] = useState(Array(12).fill(0));
  const [timer, setTimer] = useState(30);
  const [phaseTimer, setPhaseTimer] = useState(22); // Phase-specific timer
  const [gamePhase, setGamePhase] = useState(PHASES.BETTING); 
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [prevWinnerIndex, setPrevWinnerIndex] = useState(null);
  const [isWinner, setIsWinner] = useState(false);
  const [playerID, setPlayerID] = useState('player1'); // Simulating current player ID
  const [allBets, setAllBets] = useState({}); // Format: {optionIndex: {playerID: betAmount}}
  const [totalBetAmount, setTotalBetAmount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [winnersCount, setWinnersCount] = useState(0);
  const [previousWinners, setPreviousWinners] = useState([]); // Store history of winners
  
  // Animation refs
  const timerRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const walletRef = useRef();
  const winnerScale = useRef(new Animated.Value(1)).current;
  const confettiOpacity = useRef(new Animated.Value(0)).current;
  const resetFade = useRef(new Animated.Value(1)).current;

  // Initialize all bets structure
  useEffect(() => {
    const initialAllBets = {};
    for (let i = 0; i < 12; i++) {
      initialAllBets[i] = {};
    }
    setAllBets(initialAllBets);
  }, []);

  // Game timer logic
  useEffect(() => {
    startNewRound();
    return () => clearInterval(timerRef.current);
  }, []);

  // Timer handling and phase transitions
  useEffect(() => {
    // Start the pulse animation on mount for timer
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
  
    // Handle game phase transitions on timer updates
    if (timer > 0) {
      // Update phase-specific timer
      if (timer <= 30 && timer > 8) {
        setPhaseTimer(timer - 8); // Betting phase (22s)
      } else if (timer <= 8 && timer > 3) {
        setPhaseTimer(timer - 3); // Result phase (5s)
      } else {
        setPhaseTimer(timer); // Reset phase (3s)
      }
      
      // Phase transitions
      if (timer === 30) {
        setGamePhase(PHASES.BETTING);
        resetBets();
      }
      if (timer === 8) {
        setGamePhase(PHASES.RESULT);
        determineWinner();
      }
      if (timer === 3) {
        setGamePhase(PHASES.RESET);
        animateReset();
      }
    } else {
      startNewRound();
    }
  
    // Cleanup animation if needed
    return () => {
      animationLoop.stop();
    };
  }, [timer]);
  
  // Reset bets function - separate from the round start logic
  const resetBets = () => {
    setBets(Array(12).fill(0));
    setTotalBetAmount(0);
    
    // Reset all bets for new round
    const initialAllBets = {};
    for (let i = 0; i < 12; i++) {
      initialAllBets[i] = {};
    }
    setAllBets(initialAllBets);
  };
  
  // Start a new round
  const startNewRound = () => {
    clearInterval(timerRef.current);
    setTimer(30);
    setPhaseTimer(22);
    
    // If there was a winner, save it to previous winners
    if (winnerIndex !== null) {
      // Save to previous winners history (most recent first)
      setPreviousWinners(prevWinners => {
        const newWinners = [
          {
            index: winnerIndex,
            name: itemNames[winnerIndex],
            winnersCount: winnersCount
          },
          ...prevWinners.slice(0, 4) // Keep only last 5 winners
        ];
        return newWinners;
      });
      
      // Update the most recent winner for display
      setPrevWinnerIndex(winnerIndex);
    }
    
    // Reset bets and game state
    resetBets();
    setWinnerIndex(null);
    setIsWinner(false);
    setGamePhase(PHASES.BETTING);
    
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          return 30; // Reset to 30 when reached 0
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  // Determine winner logic
  const determineWinner = () => {
    // For now, choose a random winner for demonstration
    // In a real implementation, this would be synchronized with the server
    const randIndex = Math.floor(Math.random() * 12);
    setWinnerIndex(randIndex);
    
    // Animate the winning option
    animateWinner();
    
    // Check if the current player won
    if (bets[randIndex] > 0) {
      const winnings = bets[randIndex] * 8; // 8x payout
      setWalletBalance(prev => prev + winnings);
      setIsWinner(true);
      
      // Animate coins to wallet
      animateCoinsToWallet();
    } else {
      setIsWinner(false);
    }
    
    // Simulate random number of other winners
    setWinnersCount(Math.floor(Math.random() * 10) + 1);
  };

  // Place a bet on an option
  const placeBet = (index) => {
    if (gamePhase !== PHASES.BETTING || timer <= 8) {
      Alert.alert("Betting Closed", "Betting is only allowed during the betting phase.");
      return;
    }
    
    if (walletBalance < selectedChip) {
      Alert.alert("Insufficient Balance", "You don't have enough coins to place this bet.");
      return;
    }
    
    // Update current player's bets
    const newBets = [...bets];
    newBets[index] += selectedChip;
    setBets(newBets);
    
    // Update total bet amount
    setTotalBetAmount(prev => prev + selectedChip);
    
    // Update all bets structure
    const newAllBets = { ...allBets };
    if (!newAllBets[index]) {
      newAllBets[index] = {};
    }
    if (!newAllBets[index][playerID]) {
      newAllBets[index][playerID] = 0;
    }
    newAllBets[index][playerID] += selectedChip;
    setAllBets(newAllBets);
    
    // Deduct from wallet balance
    setWalletBalance(prev => prev - selectedChip);
    
    // Animate coin placement
    animateCoinPlacement(index);
  };

  // Select a chip value
  const selectChip = (value) => {
    setSelectedChip(value);
  };

  // Clear all bets
  const clearAllBets = () => {
    if (gamePhase !== PHASES.BETTING) {
      Alert.alert("Betting Closed", "You can only clear bets during the betting phase.");
      return;
    }
    
    // Refund bet amount to balance
    setWalletBalance(prev => prev + totalBetAmount);
    
    // Reset bets
    resetBets();
  };

  // Determine timer color based on phase
  const renderTimerColor = () => {
    if (timer > 8) return '#ff6b8b'; // Pink for betting phase
    if (timer > 3) return '#ffc107'; // Yellow for result phase
    return '#ff4b5c'; // Red for reset phase
  };

  // Check if any player has placed a bet on this option
  const hasBets = (index) => {
    return allBets[index] && Object.keys(allBets[index] || {}).length > 0;
  };

  // Count total number of players who bet on an option
  const countBettingPlayers = (index) => {
    return Object.keys(allBets[index] || {}).length;
  };

  // Animate winner
  const animateWinner = () => {
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

  // Animate reset phase
  const animateReset = () => {
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

  // Animate coins to wallet
  const animateCoinsToWallet = () => {
    // In a real implementation, this would move coins from the winning option to the wallet
    console.log("Animating coins to wallet");
  };

  // Animate coin placement
  const animateCoinPlacement = (index) => {
    // In a real implementation, this would animate a coin dropping onto the selected option
    console.log(`Placing coin on option ${index}`);
  };
  
  // Toggle sidebar menu
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  // Render sidebar menu
  const renderSidebar = () => {
    if (!isMenuOpen) return null;
    
    const menuItems = [
      { id: 1, icon: '🏠', label: 'Exit to Lobby' },
      { id: 2, icon: '❓', label: 'How to Play' },
      { id: 3, icon: '⚙️', label: 'Settings' }
    ];
  
    return (
      <View style={styles.sidebarContainer}>
        <TouchableOpacity
          style={[styles.sidebarItem, styles.closeButton]}
          onPress={() => setIsMenuOpen(false)}
        >
          <Text style={styles.sidebarIcon}>❌</Text>
          <Text style={styles.sidebarLabel}>Menu</Text>
        </TouchableOpacity>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.sidebarItem}
            onPress={() => {
              setIsMenuOpen(false);
              Alert.alert(item.label, `You selected ${item.label}`);
            }}
          >
            <Text style={styles.sidebarIcon}>{item.icon}</Text>
            <Text style={styles.sidebarLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render hamburger menu button
  const renderHamburgerMenu = () => (
    <TouchableOpacity style={styles.hamburgerButton} onPress={toggleMenu}>
      <View style={styles.hamburgerLine} />
      <View style={styles.hamburgerLine} />
      <View style={styles.hamburgerLine} />
    </TouchableOpacity>
  );

  // Render previous winner display - FIXED to always show
  const renderPreviousWinner = () => {
    // Only render if we have a previous winner
    if (prevWinnerIndex === null && previousWinners.length === 0) return null;
    
    // Use either the most recent winner or the first in our history
    const displayIndex = prevWinnerIndex !== null ? prevWinnerIndex : previousWinners[0]?.index;
    const displayWinnersCount = prevWinnerIndex !== null ? winnersCount : previousWinners[0]?.winnersCount;
    
    if (displayIndex === undefined) return null;

    return (
      <View style={styles.previousWinnerContainer}>
        <Text style={styles.previousWinnerTitle}>Previous Winner</Text>
        <View style={styles.previousWinnerContent}>
          <Image 
            source={itemImages[displayIndex]} 
            style={styles.previousWinnerImage}
          />
          <Text style={styles.previousWinnerName}>{itemNames[displayIndex]}</Text>
        </View>
        <Text style={styles.winnersCountText}>🏆 x{displayWinnersCount} winners</Text>
      </View>
    );
  };

  // Render game phase banner
  const renderPhaseBanner = () => {
    if (gamePhase !== PHASES.RESET) return null;
    
    return (
      <Animated.View style={[styles.resetBanner, { opacity: resetFade }]}>
        <Text style={styles.resetBannerText}>Starting New Round...</Text>
      </Animated.View>
    );
  };

  // Render individual game item
  const renderGameItem = (index) => {
    const isWinningItem = winnerIndex === index;
    
    return (
      <TouchableOpacity 
        key={index}
        style={[
          styles.itemContainer,
          isWinningItem ? styles.winnerItem : null
        ]}
        onPress={() => placeBet(index)}
        disabled={gamePhase !== PHASES.BETTING}
      >
        <Image source={itemImages[index]} style={styles.itemImage} />
                  
        {/* Confetti overlay for winner */}
        {isWinningItem && gamePhase === PHASES.RESULT && (
          <Animated.View style={[styles.confettiOverlay, { opacity: confettiOpacity }]}>
            <Text style={styles.confettiText}>✨🎉✨</Text>
          </Animated.View>
        )}
                  
        {/* Show coins with or without value based on who placed the bet */}
        {hasBets(index) && (
          <View style={styles.betOverlay}>
            {/* Public view - just show coins */}
            <View style={styles.publicCoinsContainer}>
              {Array(Math.min(countBettingPlayers(index), 3)).fill().map((_, i) => (
                <Image key={i} source={publicCoinImage} style={styles.publicCoinImage} />
              ))}
            </View>
                      
            {/* Private view - show player's own bet amount */}
            {allBets[index] && allBets[index][playerID] > 0 && (
              <View style={styles.privateBetInfo}>
                <Text style={styles.privateBetText}>₹{allBets[index][playerID]}</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderSidebar()}
      <ImageBackground
        source={require('../../assets/images/bg.jpg')} 
        style={styles.background}
        resizeMode="cover"
        blurRadius={5}
      >
        <View style={styles.container}>
          <StatusBar hidden />
          
          {/* Top Bar */}
          <View style={styles.topBar}>
            {/* Hamburger Menu */}
            {renderHamburgerMenu()}
            
            {/* Timer */}
            <Animated.View style={[styles.timerContainer, { transform: [{ scale: scaleAnim }] }]}>
              <Text style={[styles.timerText, { color: renderTimerColor() }]}>
                {phaseTimer}s
              </Text>
            </Animated.View>
            
            {/* Wallet */}
            <View ref={walletRef} style={styles.walletContainer}>
              <Image source={require('../../assets/images/wallet.png')} style={styles.walletIcon} />
              <Text style={styles.walletText}>₹ {walletBalance}</Text>
            </View>
            
            {/* Phase Banner */}
            <PhaseBanner phase={gamePhase} />
          </View>
          
          {/* Presenter Image */}
          <View style={styles.ladiesContainer}>
            <Image
              source={require('../../assets/images/lady.png')} 
              style={styles.ladiesImage}
              resizeMode="contain"
            />
          </View>
          
          {/* Reset Phase Banner */}
          {renderPhaseBanner()}
          
          {/* Items Grid */}
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              {[0, 1, 2, 3, 4, 5].map(index => renderGameItem(index))}
            </View>
            <View style={styles.gridRow}>
              {[6, 7, 8, 9, 10, 11].map(index => renderGameItem(index))}
            </View>
          </View>
          
          {/* Winner Announcement */}
          {gamePhase === PHASES.RESULT && (
            <View style={styles.resultContainer}>
              <Text style={[styles.resultText, isWinner ? styles.winText : styles.loseText]}>
                {isWinner 
                  ? `You won ₹${bets[winnerIndex] * 8}!` 
                  : 'Better luck next time!'}
              </Text>
            </View>
          )}
          
          {/* Bottom Section with Chips and Previous Winner */}
          <View style={styles.bottomSection}>
            {/* Chip Selection */}
            <View style={styles.chipSelectionContainer}>
              <View style={styles.chipSelectionRow}>
                {Object.entries(coinImages).map(([value, image]) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.chipButton,
                      selectedChip === parseInt(value) ? styles.selectedChip : null,
                      walletBalance < parseInt(value) ? styles.disabledChip : null
                    ]}
                    onPress={() => selectChip(parseInt(value))}
                    disabled={walletBalance < parseInt(value) || gamePhase !== PHASES.BETTING}
                  >
                    <Image source={image} style={styles.chipImage} />
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Clear Bets Button */}
              <TouchableOpacity
                style={[
                  styles.clearButton,
                  totalBetAmount === 0 ? styles.disabledClearButton : null
                ]}
                onPress={clearAllBets}
                disabled={gamePhase !== PHASES.BETTING || totalBetAmount === 0}
              >
                <Text style={styles.clearButtonText}>Clear Bets</Text>
              </TouchableOpacity>
            </View>
            
            {/* Previous Winner Display */}
            {renderPreviousWinner()}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}