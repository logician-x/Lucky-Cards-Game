import { StyleSheet, Dimensions } from 'react-native';

// Get screen dimensions for animations
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Original styles
  container: {
    marginTop: SCREEN_HEIGHT * 0.13,
    marginLeft: SCREEN_WIDTH * 0.3,   
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -500 }, { translateY: -50 }],
    zIndex: 200,
    width: 500,
    height: 50,
  },
  
  // Center message styles
  centerMessageContainer: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    pointerEvents: 'none',
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12, // Added for smoother appearance
  },
  messageText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2F9DFF',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
    letterSpacing: 5,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(47, 157, 255, 0.7)',
    elevation: 5,
    textTransform: 'none',
  },
  
  // Reset animation styles
  resetAnimationContainer: {
    position: 'absolute',
    top: 150,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 190,
    pointerEvents: 'none',
  },
  resetCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(47, 157, 255, 0.2)',
    borderWidth: 4,
    borderColor: '#2F9DFF',
    shadowColor: '#2F9DFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  particle: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 8,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  
  // Full-screen animation styles
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 35,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // High z-index to cover everything
    pointerEvents: 'none', // Allow touches to pass through
  },
  fullScreenOverlay: {
    position: 'absolute',
    width: SCREEN_WIDTH * 1.2, // Slightly larger than screen
    height: SCREEN_HEIGHT * 1.2,
    backgroundColor: 'rgba(0, 35, 80, 0.5)', // Dark blue tint
    zIndex: 1001,
  },
  burstEffect: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(47, 157, 255, 0.2)',
    borderWidth: 6,
    borderColor: '#2F9DFF',
    shadowColor: '#2F9DFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
    zIndex: 1002,
  },
  waveCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#2F9DFF',
    backgroundColor: 'transparent',
    shadowColor: '#2F9DFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 1003,
  },
  largeParticle: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: '#2F9DFF',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 1004,
  },
});