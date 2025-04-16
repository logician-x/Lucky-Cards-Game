// src/components/FooterIcons.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../contexts/AppContext';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { translations } from '../localization/translations';

export const FooterIcons: React.FC = () => {
  const { language, playButtonSound } = useAppContext();
  const styles = useResponsiveStyles();
  const t = translations[language];
  
  const handleIconPress = (url: string) => {
    playButtonSound();
    Linking.openURL(url);
  };
  
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity 
        style={styles.footerIcon}
        onPress={() => handleIconPress('https://example.com/license')}
      >
        <MaterialIcons name="verified-user" size={24} color="#FFD700" />
        <Text style={styles.footerText}>{t.license}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.footerIcon}
        onPress={() => handleIconPress('https://example.com/trademark')}
      >
        <MaterialIcons name="copyright" size={24} color="#FFD700" />
        <Text style={styles.footerText}>{t.trademark}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.footerIcon}
        onPress={() => handleIconPress('https://example.com/copyright')}
      >
        <MaterialIcons name="business" size={24} color="#FFD700" />
        <Text style={styles.footerText}>{t.copyright}</Text>
      </TouchableOpacity>
    </View>
  );
};