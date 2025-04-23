import React from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { styles } from '../styles/gamescreen.styles';

const TimerDisplay = ({ phaseTimer, scaleAnim, timerColor }) => {
  return (
    <Animated.View style={[styles.timerContainer, { transform: [{ scale: scaleAnim }] }]}>
      <Text style={[styles.timerText, { color: timerColor }]}>
        {phaseTimer}s
      </Text>
    </Animated.View>
  );
};


export default TimerDisplay;