import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { 
  ImageBackground, View, Animated, 
  Text, Image, TouchableOpacity, StatusBar, Alert,
  InteractionManager, Platform 
} from 'react-native';

// Components
import PhaseBanner from '../../components/PhaseBanner';
import GameItem from '../../components/GameItem';
import { Sidebar, HamburgerMenu } from '../../components/Sidebar';
import PreviousWinner from '../../components/PreviousWinner';
import ChipSelection from '../../components/ChipSelection';
import TimerDisplay from '../../components/TimerDisplay';
import NotificationBanner from '../../components/NotificationBanner';
import CoinAnimation from '../../components/CoinAnimation';

// Constants, hooks, and styles
import { PHASES, itemNames } from '../../constants/gameConstants';
import { itemImages, walletIcon, ladyPresenter, backgroundImage, coinImage, coinBagImage } from '../../constants/imageAssets';
import useServerGameTimer from '../../hooks/useGameTimer';
import { styles } from '../../styles/gamescreen.styles';
import { renderCoinAnimations } from '../../animations/gameAnimations';

// Animations
import { 
  setupAnimations, 
  startTimerPulse, 
  animateWinner, 
  animateReset, 
  animateHighlightAcrossOptions,
  animateCoinsToWallet, 
  animateCoinPlacement 
} from '../../animations/gameAnimations';

// Memoized Game Item for better performance
const MemoizedGameItem = memo(GameItem);

const GameScreen = () => {
  // State
  const [walletBalance, setWalletBalance] = useState(1000);
  const [selectedChip, setSelectedChip] = useState(10);
  const [bets, setBets] = useState(Array(12).fill(0));
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [prevWinnerIndex, setPrevWinnerIndex] = useState(null);
  const [isWinner, setIsWinner] = useState(false);
  const [playerID, setPlayerID] = useState('player1');
  const [allBets, setAllBets] = useState({});
  const [totalBetAmount, setTotalBetAmount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [winnersCount, setWinnersCount] = useState(0);
  const [previousWinners, setPreviousWinners] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [showResultText, setShowResultText] = useState(false);
  const [isAddingCoins, setIsAddingCoins] = useState(false);
  const [betLocked, setBetLocked] = useState(false);
  
  // Refs
  const walletRef = useRef();
  const hasHandledResultRef = useRef(false);
  const previousPhaseRef = useRef(null);
  const animations = setupAnimations();
  const { scaleAnim, winnerScale, confettiOpacity, resetFade } = animations;
  
  // Initialize all bets structure
  useEffect(() => {
    const initialAllBets = {};
    for (let i = 0; i < 12; i++) {
      initialAllBets[i] = {};
    }
    setAllBets(initialAllBets);
  }, []);
 
  // Start timer pulse animation
  useEffect(() => {
    const animation = startTimerPulse(scaleAnim);
    return () => animation.stop();
  }, []);

  // Handle phase change effects
  const handlePhaseChange = useCallback((phase) => {
    console.log('Phase changed to:', phase);
    
    if (phase === PHASES.BETTING) {
      // Reset state for new betting round
      hasHandledResultRef.current = false;
      setShowResultText(false);
      setIsWinner(null);
      setBetLocked(false);
      
      // Delay resetting bets to ensure animations complete
      if (previousPhaseRef.current === PHASES.RESET) {
        InteractionManager.runAfterInteractions(() => {
          resetBets();
        });
      }
    } 
    else if (phase === PHASES.RESULT) {
      // Lock betting immediately when result phase starts
      setBetLocked(true);
    }
    else if (phase === PHASES.RESET) {
      // Run reset animation
      animateReset(resetFade);
    }
    
    previousPhaseRef.current = phase;
  }, [resetFade]);
  
  // Determine winner with improved error handling
  const determineWinnerHandler = useCallback(() => {
    // Prevent multiple calls in the same phase
    if (hasHandledResultRef.current) return;
    hasHandledResultRef.current = true;
    
    console.log('🎯 Winner logic triggered');
    
    try {
      // Generate winner with requestAnimationFrame to ensure UI responsiveness
      requestAnimationFrame(() => {
        const randIndex = Math.floor(Math.random() * 12);
        
        // Run highlight animation
        animateHighlightAcrossOptions(setHighlightedIndex, randIndex, () => {
          setWinnerIndex(randIndex);
          animateWinner(winnerScale, confettiOpacity);
          
          const userPlacedAnyBets = bets.some(bet => bet > 0);
          
          if (bets[randIndex] > 0) {
            const winnings = bets[randIndex] * 10;
            
            // Update wallet with animation
            setWalletBalance(prev => prev + winnings);
            animateCoinsToWallet();
            setIsWinner(true);
          } else {
            setIsWinner(userPlacedAnyBets ? false : null);
          }
          
          setWinnersCount(Math.floor(Math.random() * 100) + 1);
          
          // Show result text after animations complete
          setTimeout(() => {
            setShowResultText(true);
          }, 2000);
        });
      });
    } catch (error) {
      console.error('Error in determineWinner:', error);
      // Fallback in case of error
      const randIndex = Math.floor(Math.random() * 12);
      setWinnerIndex(randIndex);
      setShowResultText(true);
    }
  }, [bets, winnerScale, confettiOpacity]);

  // Initialize server-synchronized game timer hook
  const { gamePhase, phaseTimer, timerColor, isServerConnected } = useServerGameTimer(
    handlePhaseChange,
    determineWinnerHandler
  );

  // Add funds to wallet
  const handleAddPress = useCallback(() => {
    // Prevent multiple rapid presses
    if (isAddingCoins) return;
    
    setIsAddingCoins(true);
    
    // Add coins with animation
    const addAmount = 500;
    setWalletBalance(prev => prev + addAmount);
    
    // Show notification
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      // Use native haptic feedback if available
      if (Platform.OS === 'ios' && Haptics) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
    
    // Reset flag after animation completes
    setTimeout(() => {
      setIsAddingCoins(false);
    }, 1000);
  }, [isAddingCoins]);
  
  // Reset bets function with improved state updates
  const resetBets = useCallback(() => {
    // If there was a winner, save it to previous winners
    if (winnerIndex !== null) {
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
      
      setPrevWinnerIndex(winnerIndex);
    }
    
    // Reset all bet-related states
    setBets(Array(12).fill(0));
    setTotalBetAmount(0);
    setWinnerIndex(null);
    
    // Reset all bets for new round using a function to ensure fresh state
    setAllBets(() => {
      const initialAllBets = {};
      for (let i = 0; i < 12; i++) {
        initialAllBets[i] = {};
      }
      return initialAllBets;
    });
  }, [winnerIndex, winnersCount]);

  // Place bet with validation and improved UX
  const placeBet = useCallback((index) => {
    // Validate phase and prevent locked betting
    if (gamePhase !== PHASES.BETTING || betLocked) {
      Alert.alert("Betting Closed", "Betting is only allowed during the betting phase.");
      return;
    }
    
    // Validate wallet balance
    if (walletBalance < selectedChip) {
      Alert.alert("Insufficient Balance", "You don't have enough coins to place this bet.");
      return;
    }
    
    // Check maximum bet limit (optional)
    const currentBet = bets[index] || 0;
    const maxBetPerOption = 500; // Example maximum bet per option
    
    if (currentBet + selectedChip > maxBetPerOption) {
      Alert.alert("Bet Limit Reached", `Maximum bet per option is ${maxBetPerOption} coins.`);
      return;
    }
    
    // Update state in a batch to prevent race conditions
    setBets(prevBets => {
      const newBets = [...prevBets];
      newBets[index] += selectedChip;
      return newBets;
    });
    
    // Update total and wallet
    setTotalBetAmount(prev => prev + selectedChip);
    setWalletBalance(prev => prev - selectedChip);
    
    // Update all bets structure
    setAllBets(prev => {
      const newAllBets = { ...prev };
      if (!newAllBets[index]) {
        newAllBets[index] = {};
      }
      newAllBets[index][playerID] = (newAllBets[index][playerID] || 0) + selectedChip;
      return newAllBets;
    });
    
    // Animate coin placement
    animateCoinPlacement(index);
  }, [gamePhase, walletBalance, selectedChip, bets, playerID, betLocked]);

  // Clear all bets with confirmation
  const clearAllBets = useCallback(() => {
    // Validate phase
    if (gamePhase !== PHASES.BETTING || betLocked) {
      Alert.alert("Betting Closed", "You can only clear bets during the betting phase.");
      return;
    }
    
    // Check if there are bets to clear
    if (totalBetAmount <= 0) {
      return; // Nothing to clear
    }
    
    // Add confirmation for larger bets
    if (totalBetAmount > 100) {
      Alert.alert(
        "Clear All Bets?",
        `Are you sure you want to clear all your bets (${totalBetAmount} coins)?`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Clear", 
            style: "destructive",
            onPress: performClearBets
          }
        ]
      );
    } else {
      performClearBets();
    }
  }, [gamePhase, totalBetAmount, betLocked]);
  
  // Helper function to perform the actual bet clearing
  const performClearBets = useCallback(() => {
    // Refund bet amount to balance
    setWalletBalance(prev => prev + totalBetAmount);
    
    // Reset bets
    setBets(Array(12).fill(0));
    setTotalBetAmount(0);
    
    // Reset player's bets in allBets structure
    setAllBets(prev => {
      const newAllBets = { ...prev };
      for (let i = 0; i < 12; i++) {
        if (newAllBets[i] && newAllBets[i][playerID]) {
          delete newAllBets[i][playerID];
        }
      }
      return newAllBets;
    });
  }, [totalBetAmount, playerID]);

  // Toggle sidebar menu
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Render game items in grid
  const renderGameItems = useCallback((startIndex, endIndex) => {
    const items = [];
    for (let index = startIndex; index <= endIndex; index++) {
      items.push(
        <MemoizedGameItem
          key={index}
          index={index}
          image={itemImages[index]}
          winnerIndex={winnerIndex}
          highlightedIndex={highlightedIndex}
          gamePhase={gamePhase}
          confettiOpacity={confettiOpacity}
          allBets={allBets}
          playerID={playerID}
          onPress={placeBet}
        />
      );
    }
    return items;
  }, [winnerIndex, highlightedIndex, gamePhase, confettiOpacity, allBets, playerID, placeBet]);

  return (
    <View style={{ flex: 1 }}>
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <ImageBackground
        source={backgroundImage} 
        style={styles.background}
        resizeMode="cover"
        blurRadius={5}
      >
        <View style={styles.container}>
          <StatusBar hidden />
          
          {/* Top Bar */}
          <View style={styles.topBar}>
            {/* Hamburger Menu */}
            <HamburgerMenu onPress={toggleMenu} />
            
            {/* Timer */}
            <TimerDisplay 
              phaseTimer={phaseTimer} 
              scaleAnim={scaleAnim} 
              timerColor={timerColor()} 
              isServerConnected={isServerConnected}
            />
             
            <TouchableOpacity 
              style={[styles.addButton, isAddingCoins && styles.addButtonActive]} 
              onPress={handleAddPress}
              disabled={isAddingCoins}
            >
              <View style={styles.addButtonContent}>
                <Text style={styles.addButtonText}>ADD</Text>
                <Image
                  source={require('../../assets/images/coin1.png')}
                  style={styles.coinIcon}
                />
              </View>
            </TouchableOpacity>
            
            {/* Phase Banner */}
            <PhaseBanner phase={gamePhase}/>
          </View>
          
          {/* Presenter Image */}
          <View style={styles.ladiesContainer}>
            <Image
              source={ladyPresenter} 
              style={styles.ladiesImage}
              resizeMode="contain"
            />
          </View>
          
          {/* Previous Winner Display */}
          <View style={styles.previousWinnerContainerRight}>
            <PreviousWinner
              prevWinnerIndex={prevWinnerIndex}
              previousWinners={previousWinners}
              winnersCount={winnersCount}
            />
          </View>
          
          {/* Items Grid - Optimized rendering */}
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              {renderGameItems(0, 5)}
            </View>
            <View style={styles.gridRow}>
              {renderGameItems(6, 11)}
            </View>
          </View>
         
          {/* Winner Announcement with conditional rendering */}       
          {gamePhase === PHASES.RESULT && showResultText && winnerIndex !== null && (
            <View style={styles.resultContainer}>
              {isWinner === true ? (
                <Text style={[styles.resultText, styles.winText]}>
                  You won ₹{bets[winnerIndex] * 10}!
                </Text>
              ) : isWinner === false ? (
                <Text style={[styles.resultText, styles.loseText]}>
                  Better luck next time!
                </Text>
              ) : null}
            </View>
          )}
          
          {/* Bottom Section with Chips */}
          <View style={styles.bottomSection}>
            <ChipSelection
              selectedChip={selectedChip}
              onSelectChip={setSelectedChip}
              walletBalance={walletBalance}
              totalBetAmount={totalBetAmount}
              onClearBets={clearAllBets}
              isDisabled={gamePhase !== PHASES.BETTING || betLocked}
            />
            {/* Wallet */}
            <View ref={walletRef} style={styles.walletContainer}>
              <Image source={walletIcon} style={styles.walletIcon} />
              <Text style={styles.walletText}>₹ {walletBalance}</Text>
            </View>
          </View>
        </View>
  
        {renderCoinAnimations()}
        <NotificationBanner />
        
        {/* Coin Animation */}
        <CoinAnimation 
          coinImage={coinImage}
          sourceImage={coinBagImage}
          gamePhase={gamePhase} 
        />
      </ImageBackground>
    </View>
  );
};

export default GameScreen;