import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { itemImages } from '../constants/imageAssets';
import { itemNames } from '../constants/gameConstants';
import { styles } from '../styles/gamescreen.styles';

const PreviousWinner = ({ prevWinnerIndex, previousWinners, winnersCount }) => {
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
        {/* <Text style={styles.previousWinnerName}>{itemNames[displayIndex]}</Text> */}
      </View>
      <Text style={styles.winnersCountText}>🏆 x{displayWinnersCount} winners</Text>
    </View>
  );
};

// const styles = StyleSheet.create({
//   previousWinnerContainer: {
//     backgroundColor: 'rgba(255, 255, 255, 0.85)',
//     borderRadius: 15,
//     padding: 10,
//     alignItems: 'center',
//     marginHorizontal: 10,
//     flex: 1,
//     maxWidth: 150,
//   },
//   previousWinnerTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   previousWinnerContent: {
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   previousWinnerImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginBottom: 5,
//   },
//   previousWinnerName: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   winnersCountText: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 5,
//   },
// });

export default PreviousWinner;