import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Animated, Easing } from 'react-native';
import { coinImages } from '../constants/imageAssets';
import { styles } from '../styles/chipSelection.styles';

const ChipSelection = ({
  selectedChip,
  onSelectChip,
  walletBalance,
  totalBetAmount,
  onClearBets,
  isDisabled,
  isActiveBetting = false,
  gameItems = [] // Array of game items with {x, y} coordinates
}) => {
  return (
    <>
     <View style={styles.chipSelectionContainer}>
  <View style={styles.rowWithButton}>
    <View style={styles.chipSelectionRow}>
      {Object.entries(coinImages).map(([value, image]) => (
        <TouchableOpacity
          key={value}
          style={[
            styles.chipButton,
            selectedChip === parseInt(value) ? styles.selectedChip : null,
            walletBalance < parseInt(value) ? styles.disabledChip : null
          ]}
          onPress={() => onSelectChip(parseInt(value))}
          disabled={walletBalance < parseInt(value) || isDisabled}
        >
          <Image source={image} style={styles.chipImage} />
        </TouchableOpacity>
      ))}
    </View>

    <TouchableOpacity
      style={[
        styles.clearButton,
        totalBetAmount === 0 ? styles.disabledClearButton : null
      ]}
      onPress={onClearBets}
      disabled={isDisabled || totalBetAmount === 0}
    >
      <Text style={styles.clearButtonText}>Rebet</Text>
    </TouchableOpacity>
  </View>
</View>
      
     
    </>
  );
};

export default ChipSelection;