// src/hooks/useResponsiveStyles.ts
import { useWindowDimensions, StyleSheet } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { themes } from '../styles/theme';

export const useResponsiveStyles = () => {
  const { width, height } = useWindowDimensions();
  const { theme } = useAppContext();
  const isLandscape = width > height;
  const currentTheme = themes[theme];
  
  return StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    container: {
      flex: 1,
      backgroundColor: currentTheme.overlay,
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
      justifyContent:'space-between',
      alignItems: 'center',
      marginTop: 50, // Make space for the settings button
    },

    gameImageContainer: {
      flex: isLandscape ? 1 : 0,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: isLandscape ? 0 : 24,
      marginRight: isLandscape ? 20 : 0,
      height: isLandscape ? 340 : 280, // Increased to accommodate the smaller images
      width: isLandscape ? 300 : 240,
      overflow: 'hidden',
    },
    
    gameImage: {
      width: isLandscape ? 240 : 180,
      height: isLandscape ? 220 : 180,
      resizeMode: 'contain',
    },
    licenseContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 1,
      gap: 12,
      marginBottom:28,
    },
    
    licenseImage: {
      width: isLandscape ? 50 : 40,
      height: isLandscape ? 50 : 40,
      borderRadius: isLandscape ? 25 : 20, // Half of width/height to make it circular
      resizeMode: 'cover', // Fill the circle
      borderWidth: 1,
      borderColor: '#ccc', // Optional: adds subtle outline
    },
    
    formContainer: {
      flex: isLandscape ? 1 : 0,
      width: isLandscape ? '50%' : '90%', // Reduced from 100% to 90%
      alignItems: 'center',
      backgroundColor: currentTheme.card,
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
      color: currentTheme.accent,
      marginBottom: 16,
    },
    subtitle: {
      color: currentTheme.text,
      marginBottom: 24,
      fontSize: 16,
      opacity: 0.7,
      textAlign: 'center',
    },
    phoneInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%', // Reduced from 100% to 90%
      marginBottom: 16,
    },
    countryCode: {
      padding: 10, // Reduced from 12 to 10
      borderWidth: 1,
      borderColor: currentTheme.border,
      backgroundColor: currentTheme.input,
      borderRadius: 8,
      marginRight: 8,
    },
    countryCodeText: {
      color: currentTheme.text,
    },
    phoneInput: {
      flex: 1,
      marginBottom: 0,
    },
    passwordContainer: {
      width: '90%', // Reduced from 100% to 90%
      marginBottom: 16,
      position: 'relative',
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: currentTheme.border,
      backgroundColor: currentTheme.input,
      color: currentTheme.text,
      padding: 10, // Reduced from 12 to 10
      borderRadius: 8,
      marginBottom: 16,
      height: 42, // Added explicit height
    },
    otpWrapper: {
      width: '90%', // Reduced from 100% to 90%
      alignItems: 'center',
      marginBottom: 16,
    },
    otpBoxesContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    otpBox: {
      width: width < 400 ? 35 : 40, // Reduced from 40/45 to 35/40
      height: width < 400 ? 35 : 40, // Reduced from 50/55 to 35/40
      borderWidth: 1,
      borderColor: currentTheme.border,
      backgroundColor: currentTheme.input,
      color: currentTheme.text,
      borderRadius: 8,
      textAlign: 'center',
      fontSize: 18, // Reduced from 20 to 18
      fontWeight: 'bold',
    },
    otpContainer: {
      width: '100%', // Reduced from 100% to 90%
      marginBottom: 24,
    },
    otpInput: {
      width: '100%',
      borderWidth: 1,
      borderColor: currentTheme.border,
      backgroundColor: currentTheme.input,
      color: currentTheme.text,
      padding: 14, 
      borderRadius: 8,
      textAlign: 'center',
      fontSize: 22, 
      letterSpacing: 8,
      fontWeight: 'bold',
      height: 45, 
    },
    eyeIcon: {
      position: 'absolute',
      right: 12,
      top: 12, 
    },
    button: {
      backgroundColor: currentTheme.accent,
      paddingVertical: 14, 
      paddingHorizontal: 32,
      borderRadius: 8,
      width: '90%', 
      alignItems: 'center',
      marginTop: 10,
      marginBottom:60,
    },
    buttonText: {
      color: '#000',
      fontWeight: 'bold',
      fontSize: 16,
    },
    resendButton: {
      marginTop: 8,
      padding: 8,
    },
    resendText: {
      color: currentTheme.accent,
      fontSize: 14,
      fontWeight: '500',
    },
    languageSelectorContainer: {
      width: '100%', 
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 16,
    },
    languageButton: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 4,
      marginLeft: 8,
    },
    activeLanguage: {
      backgroundColor: currentTheme.accent,
    },
    languageText: {
      color: currentTheme.text,
      fontWeight: '500',
    },
    activeLanguageText: {
      color: '#000',
    },
    footerContainer: {
      width: '100%', 
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 24,
    },
    footerIcon: {
      alignItems: 'center',
    },
    footerText: {
      color: currentTheme.text,
      marginTop: 4,
      fontSize: 12,
    },
    settingsContainer: {
      flex: 1,
      backgroundColor: currentTheme.background,
      padding: 24,
     
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.border,
    },
    settingLabel: {
      color: currentTheme.text,
      fontSize: 18,
    },
    settingValue: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingOption: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 4,
      marginLeft: 8,
    },
    activeOption: {
      backgroundColor: currentTheme.accent,
    },
    optionText: {
      color: currentTheme.text,
    },
    activeOptionText: {
      color: '#000',
    },
    otpButtonsContainer: {
      width: '100%',
      alignItems: 'center',
    },
    
    textButton: {
      width: '90%',
      alignItems: 'center',
      padding: 10,
    },
    
    textButtonText: {
      color: currentTheme.accent,
      fontSize: 14,
      fontWeight: '500',
    }
  });
};