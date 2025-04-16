// src/components/LanguageSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { translations } from '../localization/translations';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, playButtonSound } = useAppContext();
  const styles = useResponsiveStyles();
  
  const handleLanguageChange = (lang: 'english' | 'hindi') => {
    playButtonSound();
    setLanguage(lang);
  };
  
  return (
    <View style={styles.languageSelectorContainer}>
      <TouchableOpacity
        style={[
          styles.languageButton,
          language === 'english' && styles.activeLanguage
        ]}
        onPress={() => handleLanguageChange('english')}
      >
        <Text
          style={[
            styles.languageText,
            language === 'english' && styles.activeLanguageText
          ]}
        >
          English
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.languageButton,
          language === 'hindi' && styles.activeLanguage
        ]}
        onPress={() => handleLanguageChange('hindi')}
      >
        <Text
          style={[
            styles.languageText,
            language === 'hindi' && styles.activeLanguageText
          ]}
        >
          हिंदी
        </Text>
      </TouchableOpacity>
    </View>
  );
};