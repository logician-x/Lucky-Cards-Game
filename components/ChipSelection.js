import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { coinImages } from '../constants/imageAssets';
import { styles } from '../styles/gamescreen.styles';

const ChipSelection = ({
  selectedChip,
  onSelectChip,
  walletBalance,
  totalBetAmount,
  onClearBets,
  isDisabled
}) => {
  return (
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
            onPress={() => onSelectChip(parseInt(value))}
            disabled={walletBalance < parseInt(value) || isDisabled}
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
        onPress={onClearBets}
        disabled={isDisabled || totalBetAmount === 0}
      >
        <Text style={styles.clearButtonText}>Clear Bets</Text>
      </TouchableOpacity>
    </View>
  );
};



export default ChipSelection;