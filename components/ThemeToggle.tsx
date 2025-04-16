// src/components/ThemeToggle.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { translations } from '../localization/translations';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, language, playButtonSound } = useAppContext();
  const styles = useResponsiveStyles();
  const t = translations[language];
  
  const handleToggle = () => {
    playButtonSound();
    toggleTheme();
  };
  
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{t.theme}</Text>
      <View style={styles.settingValue}>
        <TouchableOpacity
          style={[
            styles.settingOption,
            theme === 'dark' && styles.activeOption
          ]}
          onPress={theme === 'light' ? handleToggle : undefined}
        >
          <Text
            style={[
              styles.optionText,
              theme === 'dark' && styles.activeOptionText
            ]}
          >
            {t.dark}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.settingOption,
            theme === 'light' && styles.activeOption
          ]}
          onPress={theme === 'dark' ? handleToggle : undefined}
        >
          <Text
            style={[
              styles.optionText,
              theme === 'light' && styles.activeOptionText
            ]}
          >
            {t.light}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};