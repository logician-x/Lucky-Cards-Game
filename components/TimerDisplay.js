import React from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { styles } from '../styles/gamescreen.styles';
import { PHASES } from '../constants/gameConstants'; // Import PHASES constant

const TimerDisplay = ({ phaseTimer, scaleAnim, timerColor, gamePhase, isServerConnected }) => {
  // Only show timer during betting phase
  if (gamePhase !== PHASES.BETTING) {
    return null;
  }

  return (
    <Animated.View style={[styles.timerContainer, { transform: [{ scale: scaleAnim }] }]}>
      <Text style={[styles.timerText, { color: timerColor }]}>
        {phaseTimer}s
      </Text>
    </Animated.View>
  );
};

export default TimerDisplay;