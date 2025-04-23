// src/screens/SettingsScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { translations } from '../localization/translations';
import { ThemeToggle } from '../components/ThemeToggle';
import { SoundToggle } from '../components/SoundToggle';

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const {
    language,
    setLanguage,
    playButtonSound,
    soundsLoaded,
  } = useAppContext();
  
  const styles = useResponsiveStyles();
  const t = translations[language];
  
  const handleBackPress = () => {
    playButtonSound();
    navigation.goBack();
  };
  
  const handleLanguageChange = (lang: 'english' | 'hindi') => {
    playButtonSound();
    setLanguage(lang);
  };
  
  // Remove the unconditional sound playback that was here before
  
  return (
    <View style={styles.settingsContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={{ marginRight: 16 }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFD700' }}>
          {t.settings}
        </Text>
      </View>
      
      <ScrollView>
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Sound Toggle */}
        <SoundToggle />
        
        {/* Language Selection */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>{t.language}</Text>
          <View style={styles.settingValue}>
            <TouchableOpacity
              style={[
                styles.settingOption,
                language === 'english' && styles.activeOption
              ]}
              onPress={() => handleLanguageChange('english')}
            >
              <Text
                style={[
                  styles.optionText,
                  language === 'english' && styles.activeOptionText
                ]}
              >
                English
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.settingOption,
                language === 'hindi' && styles.activeOption
              ]}
              onPress={() => handleLanguageChange('hindi')}
            >
              <Text
                style={[
                  styles.optionText,
                  language === 'hindi' && styles.activeOptionText
                ]}
              >
                हिंदी
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;