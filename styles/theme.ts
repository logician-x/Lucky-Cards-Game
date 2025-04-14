import { useWindowDimensions, StyleSheet } from 'react-native';

export const useResponsiveStyles = () => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent overlay
      padding: 24,
      position: 'relative',
    },
    settingsButton: {
      position: 'absolute',
      top: 40,
      left: 24,
      zIndex: 10,
      padding: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backButton: {
      position: 'absolute',
      top: 40,
      right: 24,
      zIndex: 10,
      padding: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    contentContainer: {
      flex: 1,
      flexDirection: isLandscape ? 'row' : 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50, // Make space for the settings button
    },
    gameImageContainer: {
      flex: isLandscape ? 1 : 0,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: isLandscape ? 0 : 24,
      marginRight: isLandscape ? 20 : 0,
      height: isLandscape ? 300 : 220,
      width: isLandscape ? 300 : 220,
      overflow: 'hidden',
    },
    gameImage: {
      width: isLandscape ? 280 : 200,
      height: isLandscape ? 280 : 200,
      resizeMode: 'contain',
    },
    formContainer: {
      flex: isLandscape ? 1 : 0,
      width: isLandscape ? '50%' : '100%',
      alignItems: 'center',
      backgroundColor: 'rgba(18, 18, 18, 0.8)',
      padding: 24,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 6,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFD700',
      marginBottom: 16,
    },
    subtitle: {
      color: '#aaa',
      marginBottom: 24,
      fontSize: 16,
    },
    phoneInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginBottom: 16,
    },
    countryCode: {
      padding: 12,
      borderWidth: 1,
      borderColor: '#333',
      backgroundColor: '#1e1e1e',
      borderRadius: 8,
      marginRight: 8,
    },
    countryCodeText: {
      color: '#aaa',
    },
    phoneInput: {
      flex: 1,
      marginBottom: 0,
    },
    passwordContainer: {
      width: '100%',
      marginBottom: 16,
      position: 'relative',
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#333',
      backgroundColor: '#1e1e1e',
      color: '#fff',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    otpContainer: {
      width: '100%',
      marginBottom: 24,
    },
    otpInput: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#333',
      backgroundColor: '#1e1e1e',
      color: '#fff',
      padding: 16,
      borderRadius: 8,
      textAlign: 'center',
      fontSize: 24,
      letterSpacing: 8,
      fontWeight: 'bold',
    },
    eyeIcon: {
      position: 'absolute',
      right: 12,
      top: 14,
    },
    button: {
      backgroundColor: '#FFD700',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#000',
      fontWeight: 'bold',
      fontSize: 16,
    },
    resendButton: {
      marginTop: 20,
      padding: 8,
    },
    resendText: {
      color: '#FFD700',
      fontSize: 14,
      fontWeight: '500',
    },
  });
};