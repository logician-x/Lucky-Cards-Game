// src/components/SoundToggle.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { translations } from '../localization/translations';

export const SoundToggle: React.FC = () => {
  const { soundEnabled, toggleSound, language, playButtonSound } = useAppContext();
  const styles = useResponsiveStyles();
  const t = translations[language];
  
  const handleToggle = () => {
    if (soundEnabled) {
      playButtonSound();
    }
    toggleSound();
  };
  
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{t.sound}</Text>
      <View style={styles.settingValue}>
        <TouchableOpacity
          style={[
            styles.settingOption,
            soundEnabled && styles.activeOption
          ]}
          onPress={!soundEnabled ? handleToggle : undefined}
        >
          <Text
            style={[
              styles.optionText,
              soundEnabled && styles.activeOptionText
            ]}
          >
            {t.on}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.settingOption,
            !soundEnabled && styles.activeOption
          ]}
          onPress={soundEnabled ? handleToggle : undefined}
        >
          <Text
            style={[
              styles.optionText,
              !soundEnabled && styles.activeOptionText
            ]}
          >
            {t.off}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};