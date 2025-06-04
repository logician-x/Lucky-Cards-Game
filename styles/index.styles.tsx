import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get('window');

// Modified responsive sizing helper for smaller content
const size = (baseSize: number) => {
  // Scale sizes based on screen width but with a smaller factor
  const scale = width / 420; // Smaller baseline for more compact UI
  const newSize = baseSize * 0.85 * scale; // 15% reduction applied to all sizes
  
  // Cap maximum size with a smaller cap
  return Math.min(newSize, baseSize * 1.1);
};

// Color palette
const colors = {
  primary: '#8B4513',
  primaryDark: '#6B3100',
  accent: '#DAA520',
  accentLight: '#FFD700',
  accentDark: '#B8860B',
  success: '#4CAF50',
  info: '#2196F3',
  warning: '#FFC107',
  danger: '#D32F2F',
  background: '#000000',
  cardBg: 'rgba(30, 30, 30, 0.8)',
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textMuted: '#999999',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: size(10), // Reduced from 10
    paddingRight: size(50), // Reduced from 15
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    elevation: 5,
    shadowColor: colors.accentLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // Logo styles
  logoContainer: {
    position: 'absolute',
    top: 5, // Reduced from 10
    left: 10, // Reduced from 15
    zIndex: 10,
  },
  logo: {
    width: 90, // Reduced from 110
    height: 40, // Reduced from 50
    backgroundColor: '#D4AF37', // Gold color
    borderRadius: 8, // Reduced from 10
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1, // Reduced from 2
    borderColor: '#FFF',
  },
  logoText: {
    fontSize: 18, // Reduced from 22
    fontWeight: 'bold',
    color: '#8B0000', // Dark red
    textAlign: 'center',
    letterSpacing: 1,
  },
  logoSubText: {
    fontSize: 10, // Reduced from 12
    fontWeight: '600',
    color: '#8B0000', // Dark red
    textAlign: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: size(35), // Reduced from 40
    height: size(35), // Reduced from 40
    marginLeft: size(5),
    borderRadius: size(18), // Reduced from 20
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1, // Reduced from 2
    borderColor: colors.accentLight,
  },
  avatarText: {
    color: colors.textPrimary,
    fontSize: size(14), // Reduced from 16
    fontWeight: 'bold',
  },
  userTextContainer: {
    marginLeft: size(8), // Reduced from 10
  },
  userName: {
    color: colors.textPrimary,
    fontSize: size(12), // Reduced from 14
    fontWeight: 'bold',
  },
  userId: {
    color: colors.textSecondary,
    fontSize: size(9), // Reduced from 10
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  balancePill: {
    backgroundColor: colors.accent,
    borderRadius: size(6), // Reduced from 8
    paddingHorizontal: size(10), // Reduced from 12
    paddingVertical: size(3), // Reduced from 4
    marginHorizontal: size(3), // Reduced from 4
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.accentLight,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  currencySymbol: {
    color: colors.accentLight,
    fontSize: size(16), // Reduced from 18
    fontWeight: 'bold',
  },
  balanceText: {
    color: colors.textPrimary,
    marginLeft: size(3), // Reduced from 4
    fontSize: size(14), // Reduced from 16
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: colors.success,
    padding: size(5), // Reduced from 6
    borderRadius: size(6), // Reduced from 8
    marginHorizontal: size(3), // Reduced from 4
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  withdrawButton: {
    backgroundColor: colors.accentLight,
  },
  buttonText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: size(10), // Reduced from 12
  },
  iconButtonGroup: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  iconButton: {
    backgroundColor: colors.accentLight,
    width: size(28), // Reduced from 32
    height: size(24), // Reduced from 32
    borderRadius: size(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: size(3), // Reduced from 4
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  notificationBanner: {
    backgroundColor: 'rgba(239, 232, 232, 0.8)',
    padding: size(6), // Reduced from 8
    overflow: 'hidden',
    height: size(25), // Reduced from 30
    justifyContent: 'center',
  },
  notificationText: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    width: width * 2,
  },
  tealText: {
    color: '#4DD0E1',
    fontSize: size(12), // Reduced from 14
    fontWeight: 'bold',
  },
  whiteText: {
    color: colors.textPrimary,
    fontSize: size(12), // Reduced from 14
  },
  yellowText: {
    color: colors.accentLight,
    fontSize: size(12), // Reduced from 14
    fontWeight: 'bold',
  },
  orangeText: {
    color: '#FF7043',
    fontSize: size(12), // Reduced from 14
    fontWeight: 'bold',
  },
  backgroundContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(119, 110, 110, 0.8)',
  },
  mainContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: size(12), // Reduced from 16
    paddingTop: size(15), // Reduced from 20
  },

 

  gameIcon: {
    width: size(120), // Reduced from 150
    height: size(120), // Reduced from 150
    backgroundColor: colors.accentLight,
    borderRadius: size(60), // Reduced from 75
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: size(10), // Reduced from 12
    borderWidth: 3, // Reduced from 4
    borderColor: 'rgba(255, 215, 0, 0.3)',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gameIconText: {
    color: colors.primary,
    fontSize: size(30), // Reduced from 36
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameName: {
    color: colors.textPrimary,
    fontSize: size(16), // Reduced from 20
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  playButton: {
    position: 'absolute',
    bottom: size(-14), // Reduced from -16
    backgroundColor: colors.danger,
    paddingHorizontal: size(16), // Reduced from 20
    paddingVertical: size(6), // Reduced from 8
    borderRadius: size(16), // Reduced from 20
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playButtonText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: size(12), // Reduced from 14
  },
  
  bottomNav: {
    backgroundColor: colors.primary,
    padding: size(6), // Reduced from 8
    paddingTop: size(8), // Reduced from 10
    paddingBottom: Platform.OS === 'ios' ? size(20) : size(8), // Reduced from 25/10
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.accent,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: size(8), 
    paddingVertical: size(4), // Reduced from 5
  },
  navIcon: {
    fontSize: size(20), // Reduced from 24
    marginBottom: size(2),
  },
  navLabel: {
    color: colors.textPrimary,
    fontSize: size(9), // Reduced from 10
    fontWeight: '500',
  },
  
   gameIconImage: {
  width: 300,
  height: 200,
  borderRadius: 16,
  marginVertical: 15,
  alignSelf: 'center',
  overflow: 'hidden', // ← THIS IS THE KEY FIX!
  backgroundColor: 'transparent', // Prevents background conflicts
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 8,
},
  
  // If you want a container for the game icon with additional styling
  gameIconContainer: {
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  
  // For the hot tag that overlays on the game icon
  hotTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF4500',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  hotTagText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // For responsive design
  gameIconImageSmall: {
    width: 240,
    height: 160,
  },
  
  // Style for when the icon is pressed
  gameIconPressed: {
    opacity: 0.8,
    transform: [{scale: 0.98}],
  },
  gameIconImageWithBorder: {
  width: 300,
  height: 200,
  borderRadius: 16,
  borderWidth: 3,
  borderColor: '#FFD700', // Gold border
  marginVertical: 15,
  alignSelf: 'center',
  overflow: 'hidden', // Critical!
  backgroundColor: 'transparent',
  shadowColor: '#FFD700',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.4,
  shadowRadius: 6,
  elevation: 10,
},
gameIconImageDiamond: {
  width: 220,
  height: 220,
  alignSelf: 'center',
  marginVertical: 30, // Extra margin for rotated shape
  transform: [{ rotate: '45deg' }], // Rotate container 45 degrees
  borderRadius: 20, // Rounded corners for softer diamond
  borderWidth: 4,
  borderColor: '#FFD700', // Gold border
  overflow: 'hidden', // Essential for clipping
  backgroundColor: 'transparent',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.4,
  shadowRadius: 8,
  elevation: 12,
},
hotTagFixed: {
  position: 'absolute',
  top: -5,
  right: '8%',
  backgroundColor: '#FF4500',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 15,
  zIndex: 10,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,
}
});