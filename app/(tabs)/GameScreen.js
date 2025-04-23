import React, { useState, useEffect, useRef } from 'react';
import { 
  ImageBackground, View, Animated, 
  Text, Image, TouchableOpacity, StatusBar, Alert 
} from 'react-native';

// Components
import PhaseBanner from '../../components/PhaseBanner';
import GameItem from '../../components/GameItem';
import { Sidebar, HamburgerMenu } from '../../components/Sidebar';
import PreviousWinner from '../../components/PreviousWinner';
import ChipSelection from '../../components/ChipSelection';
import TimerDisplay from '../../components/TimerDisplay';
import NotificationBanner from '../../components/NotificationBanner';

// Constants, hooks, and styles
import { PHASES, itemNames } from '../../constants/gameConstants';
import { itemImages, walletIcon, ladyPresenter, backgroundImage } from '../../constants/imageAssets';
import useGameTimer from '../../hooks/useGameTimer';
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

const GameScreen = () => {
  // State
  const [walletBalance, setWalletBalance] = useState(1000);
  const [selectedChip, setSelectedChip] = useState(10);
  const [bets, setBets] = useState(Array(12).fill(0));
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [prevWinnerIndex, setPrevWinnerIndex] = useState(null);
  const [isWinner, setIsWinner] = useState(false);
  const [playerID, setPlayerID] = useState('player1'); // Simulating current player ID
  const [allBets, setAllBets] = useState({}); // Format: {optionIndex: {playerID: betAmount}}
  const [totalBetAmount, setTotalBetAmount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [winnersCount, setWinnersCount] = useState(0);
  const [previousWinners, setPreviousWinners] = useState([]); // Store history of winners
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const hasHandledResultRef = useRef(false);
  const [showResultText, setShowResultText] = useState(false);

  // Animation refs
  const walletRef = useRef();
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

  // Game timer and phase management
  const handlePhaseChange = (phase) => {
    console.log('Phase changed to:', phase);
    
    if (phase === PHASES.BETTING) {
      hasHandledResultRef.current = false; // Reset for new round
      resetBets();
    } else if (phase === PHASES.RESET) {
      animateReset(resetFade);
    }
  };
  
  // Handle phase change effects
  useEffect(() => {
    if (gamePhase === PHASES.BETTING) {
      setShowResultText(false); // Hide message for new round
      setIsWinner(null);        // Reset winner status
    }
  }, [gamePhase]);

  // In your determineWinnerHandler function:
  const determineWinnerHandler = () => {
    if (hasHandledResultRef.current) return; // Already called
    hasHandledResultRef.current = true;     // Mark as called

    console.log('🎯 Winner logic triggered');

    const randIndex = Math.floor(Math.random() * 12);

    animateHighlightAcrossOptions(setHighlightedIndex, randIndex, () => {
      setWinnerIndex(randIndex);
      animateWinner(winnerScale, confettiOpacity);
    
      const userPlacedAnyBets = bets.some(bet => bet > 0);
    
      if (bets[randIndex] > 0) {
        const winnings = bets[randIndex] * 10;
        setWalletBalance(prev => prev + winnings);
        setIsWinner(true);
        animateCoinsToWallet();
      } else {
        setIsWinner(userPlacedAnyBets ? false : null);
      }
    
      setWinnersCount(Math.floor(Math.random() * 100) + 1);
    
      // Wait until everything is settled
      setTimeout(() => {
        setShowResultText(true);
      }, 2000); // Adjust based on how long your animations last
    });
  };

  // Initialize game timer hook
  const { gamePhase, phaseTimer, timerColor } = useGameTimer(
    handlePhaseChange,
    determineWinnerHandler
  );

  const handleAddPress = () => {
    // Open a modal, show options, or directly add money
    console.log('Add button pressed');
  };
  
  // Reset bets function - separate from the round start logic
  const resetBets = () => {
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
    
    setBets(Array(12).fill(0));
    setTotalBetAmount(0);
    setWinnerIndex(null);
    
    // Reset all bets for new round
    const initialAllBets = {};
    for (let i = 0; i < 12; i++) {
      initialAllBets[i] = {};
    }
    setAllBets(initialAllBets);
  };

  // Place a bet on an option
  const placeBet = (index) => {
    if (gamePhase !== PHASES.BETTING) {
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

  // Clear all bets
  const clearAllBets = () => {
    if (gamePhase !== PHASES.BETTING) {
      Alert.alert("Betting Closed", "You can only clear bets during the betting phase.");
      return;
    }
    
    // Refund bet amount to balance
    setWalletBalance(prev => prev + totalBetAmount);
    
    // Reset bets
    setBets(Array(12).fill(0));
    setTotalBetAmount(0);
    
    // Reset player's bets in allBets structure
    const newAllBets = { ...allBets };
    for (let i = 0; i < 12; i++) {
      if (newAllBets[i] && newAllBets[i][playerID]) {
        delete newAllBets[i][playerID];
      }
    }
    setAllBets(newAllBets);
  };

  // Toggle sidebar menu
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

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
            />
            
            {/* Wallet */}
            <View ref={walletRef} style={styles.walletContainer}>
              <Image source={walletIcon} style={styles.walletIcon} />
              <Text style={styles.walletText}>₹ {walletBalance}</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
               <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            
            {/* Phase Banner */}
            <PhaseBanner phase={gamePhase} />
          </View>
          
          {/* Presenter Image */}
          <View style={styles.ladiesContainer}>
            <Image
              source={ladyPresenter} 
              style={styles.ladiesImage}
              resizeMode="contain"
            />
          </View>
          
          {/* Items Grid */}
          <View style={styles.gridContainer}>
          
            <View style={styles.gridRow}>
              {[0, 1, 2, 3, 4, 5].map(index => (
                <GameItem
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
              ))}
            </View>
            <View style={styles.gridRow}>
              {[6, 7, 8, 9, 10, 11].map(index => (
                <GameItem
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
              ))}
            </View>
          </View>
         
          {/* Winner Announcement */}       
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
          
          {/* Bottom Section with Chips and Previous Winner */}
          <View style={styles.bottomSection}>
            {/* Chip Selection */}
            <ChipSelection
              selectedChip={selectedChip}
              onSelectChip={setSelectedChip}
              walletBalance={walletBalance}
              totalBetAmount={totalBetAmount}
              onClearBets={clearAllBets}
              isDisabled={gamePhase !== PHASES.BETTING}
            />
            
            {/* Previous Winner Display */}
            <PreviousWinner
              prevWinnerIndex={prevWinnerIndex}
              previousWinners={previousWinners}
              winnersCount={winnersCount}
            />
          </View>
        </View>
        {renderCoinAnimations()}
      </ImageBackground>
    </View>
  );
};

export default GameScreen;