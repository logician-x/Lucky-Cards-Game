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

// const styles = StyleSheet.create({
//   timerContainer: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   timerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
// });

export default TimerDisplay;