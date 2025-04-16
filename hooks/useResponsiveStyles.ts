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
      width: '100%',
      marginBottom: 16,
      position: 'relative',
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: currentTheme.border,
      backgroundColor: currentTheme.input,
      color: currentTheme.text,
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
      borderColor: currentTheme.border,
      backgroundColor: currentTheme.input,
      color: currentTheme.text,
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
      backgroundColor: currentTheme.accent,
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
  });
};