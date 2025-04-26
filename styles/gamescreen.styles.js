import { StyleSheet, Dimensions } from "react-native";

// Get device dimensions
const { width, height } = Dimensions.get('window');
const scale = Math.min(width / 400, height / 800); // Base scale factor
const itemSize = Math.min(width / 8, height / 5);

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
    },
    background: {
      flex: 1,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 0,
      marginBottom: 0,
    },
    hamburgerButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 8,
      padding: 8,
      zIndex: 100,
      position: 'absolute',
      top: 10,
      left: 10,
    },
    hamburgerLine: {
      width: 24,
      height: 3,
      backgroundColor: 'white',
      marginVertical: 3,
      borderRadius: 2,
    },
    sidebarContainer: {
      position: 'absolute',
      left: 0,
      top: 13,
      bottom: 0,
      width: 160,
      height: 165,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      borderRightWidth: 2,
      borderColor: '#FFD700',
      paddingTop: 0,
    },
    sidebarItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 0,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    },
    sidebarIcon: {
      fontSize: 24,
      marginRight: 15,
      color: 'white',
    },
    sidebarLabel: {
      color: 'white',
      fontSize: 16,
    },
    walletContainer: {
  backgroundColor: '#8B0000', // Deeper red for a more intense gaming feel
  flexDirection: 'row',
  alignItems: 'center',
  position: 'absolute',
  top: 166,
  left: width > 400 ? 150 : width / 2,
  paddingVertical: 7
  ,
  paddingHorizontal: 0,
  borderRadius: 20,
  borderWidth: 0,
  borderColor: '#FFD700', // Gold border for a premium feel
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.6,
  shadowRadius: 5,
  elevation: 8,
  zIndex: 99,
},

walletIcon: {
  width: 40,
  height: 40,
  resizeMode: 'contain',
  marginRight: 0,
},

walletText: {
  color: '#FFD700', // Bright Gold
  fontWeight: 'bold',
  fontSize: 18,
  fontFamily: 'serif', // More royal, game-style font
  textShadowColor: '#000',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
},

    addButton: {
      top: 10,
      marginLeft: 730,
      backgroundColor: '#8B0000', // Dark red
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 5,
    },
    addButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addButtonText: {
      color: '#FFD700', // Gold
      fontWeight: 'bold',
      fontSize: 16,
      fontFamily: 'serif', // Slightly fancy font
      marginRight: 6,
    },
    coinIcon: {
      width: 25,
      height: 20,
    },
    timerContainer: {
      position: 'absolute',
      top: 70,
      right: width > 400 ? 325 : width - 75,
      width: 40,
      height: 40,
      backgroundColor: '#1a1a1a',
      borderRadius: 25,
      borderWidth: 2,
      borderColor: '#ff2e63',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      zIndex: 99,
    },
    timerText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 22,
    },
    ladiesContainer: {
      position: 'absolute',
      top: 0,
      alignSelf: 'center',
      zIndex: 99,
    },
    ladiesImage: {
      width: 100,
      height: 120,
    },
    gridContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
    },
    gridRow: {
      marginTop: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 5,
    },
    itemContainer: {
      width: itemSize,
      height: itemSize,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 7,
      borderWidth: 2,
      borderColor: '#7e1ea2',
      margin: 7,
      overflow: 'hidden',
    },
  
    itemImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    confettiOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 215, 0, 0.2)',
    },
    confettiText: {
      fontSize: 24,
      textAlign: 'center',
    },
    betOverlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    publicCoinsContainer: {
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    publicCoinImage: {
      width: itemSize * 0.25,
      height: itemSize * 0.25,
      resizeMode: 'contain',
      marginHorizontal: 2,
    },
    privateBetInfo: {
      position: 'absolute',
      bottom: 5,
      backgroundColor: 'rgba(255, 75, 92, 0.8)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 10,
    },
    privateBetText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
      textAlign: 'center',
    },
    bottomSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 0,
      marginBottom: 10,
      position: 'absolute',
      bottom: 10,
      left: 0,
      right: 0,
    },
   
    // Responsive previous winner container on right side
    previousWinnerContainerRight: {
      position: 'absolute',
      right: width * 0.06,  // 5% from right edge
      top: '50%',
      transform: [{ translateY: -60 }],  // Center vertically with offset
      zIndex: 90,
      width: width * 0.12,  // 12% of screen width
      maxWidth: 120,        // Maximum width
      minWidth: 80,         // Minimum width
    },
    previousWinnerContainer: {
      backgroundColor: 'rgba(90, 235, 235, 0.5)',
      borderRadius: 10,
      padding: 5,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#FFD700',
    },
    previousWinnerTitle: {
      color: 'red',
      fontSize: 10,
      marginBottom: 5,
      fontWeight: 'bold',
    },
    previousWinnerContent: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    previousWinnerImage: {
      width: 50,
      height: 50,
      borderRadius: 5,
      marginBottom: 5,
      borderWidth: 2,
      borderColor: '#FFD700',
    },
    previousWinnerName: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
    winnersCountText: {
      color: '#ffc107',
      fontSize: 12,
      marginTop: 5,
    },
    resultContainer: {
      position: 'absolute',
      top: '45%',
      alignSelf: 'center',
      backgroundColor: 'rgba(255,255,255,0.9)',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#ff6b8b',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
    },
    resultText: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    winText: {
      color: '#ff4b5c',
    },
    loseText: {
      color: '#666',
    },
   
    highlightedItem: {
      borderWidth: 3,
      borderColor: 'gold',
      borderRadius: 12,
      backgroundColor: '#fff7cc',
    },
    modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainer: {
  width: '80%',
  maxWidth: 400,
},
modalBox: {
  backgroundColor: '#222',
  borderRadius: 10,
  padding: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  position: 'relative',
},
closeModalButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  width: 30,
  height: 30,
  justifyContent: 'center',
  alignItems: 'center',
},
closeModalText: {
  color: '#999',
  fontSize: 20,
  fontWeight: 'bold',
},
modalContent: {
  paddingTop: 15,
  paddingBottom: 5,
},
modalTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: 'white',
  marginBottom: 15,
  textAlign: 'center',
},
modalText: {
  fontSize: 16,
  color: '#DDD',
  marginBottom: 20,
  lineHeight: 24,
},
modalButton: {
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
  backgroundColor: '#333',
  marginHorizontal: 5,
  alignItems: 'center',
},
primaryButton: {
  backgroundColor: '#4A90E2',
},
modalButtonText: {
  color: '#DDD',
  fontSize: 16,
},
primaryButtonText: {
  color: 'white',
},
treasureImage: {
  position: 'absolute',
  width: 100,
  height: 100,
  resizeMode: 'contain',
},
coin: {
  position: 'absolute',
  resizeMode: 'contain',
}
});