import React from 'react';
import { TouchableOpacity, Image, View, Text, Animated, StyleSheet } from 'react-native';
import { PHASES } from '../constants/gameConstants';

const GameItem = ({
  index,
  image,
  winnerIndex,
  gamePhase,
  highlightedIndex,
  confettiOpacity,
  allBets,
  playerID,
  onPress,
}) => {
  const isHighlighted = highlightedIndex === index;
  const isWinningItem = winnerIndex === index;
  
  // Check if any player has placed a bet on this option
  const hasBets = () => {
    return allBets[index] && Object.keys(allBets[index] || {}).length > 0;
  };
  
  // Count total number of players who bet on an option
  const countBettingPlayers = () => {
    return Object.keys(allBets[index] || {}).length;
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        isWinningItem ? styles.winnerItem : null,
        isHighlighted ? styles.highlightedItem : null,
      ]}
      onPress={() => onPress(index)}
      disabled={gamePhase !== PHASES.BETTING}
    >
      <Image source={image} style={styles.itemImage} />
      
      {/* Confetti overlay for winner */}
      {isWinningItem && gamePhase === PHASES.RESULT && (
        <Animated.View style={[styles.confettiOverlay, { opacity: confettiOpacity }]}>
          <Text style={styles.confettiText}>✨🎉✨</Text>
        </Animated.View>
      )}
      
      {/* Show coins with or without value based on who placed the bet */}
      {hasBets() && (
        <View style={styles.betOverlay}>
          {/* Public view - just show coins indicating other players */}
          <View style={styles.publicCoinsContainer}>
            {Array(Math.min(countBettingPlayers(), 3)).fill().map((_, i) => (
              <Image 
                key={i} 
                source={require('../assets/images/coin1.png')} 
                style={styles.publicCoinImage} 
              />
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

// Component-specific styles
const styles = StyleSheet.create({
  itemContainer: {
    width: 80,
    height: 80,
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  highlightedItem: {
    borderColor: '#FFD700',
    borderWidth: 3,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  winnerItem: {
    borderColor: '#FFD700',
    borderWidth: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    transform: [{ scale: 1.05 }],
  },
  itemImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  confettiOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  confettiText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  betOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  publicCoinsContainer: {
    flexDirection: 'row',
    marginRight: 2,
  },
  publicCoinImage: {
    width: 15,
    height: 15,
    marginLeft: -5, // Overlap coins
  },
  privateBetInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  privateBetText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
  }
});

export default GameItem;