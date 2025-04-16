// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { StatusBar } from 'react-native';
import { themes } from '../styles/theme';

// Define types
export type ThemeType = 'dark' | 'light';
export type LanguageType = 'english' | 'hindi';

interface AppContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  playButtonSound: () => Promise<void>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create provider
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [language, setLanguage] = useState<LanguageType>('english');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [backgroundSound, setBackgroundSound] = useState<Audio.Sound | null>(null);
  const [buttonSound, setButtonSound] = useState<Audio.Sound | null>(null);

  // Load settings from storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        const storedLanguage = await AsyncStorage.getItem('language');
        const storedSoundEnabled = await AsyncStorage.getItem('soundEnabled');
        
        if (storedTheme) setTheme(storedTheme as ThemeType);
        if (storedLanguage) setLanguage(storedLanguage as LanguageType);
        if (storedSoundEnabled) setSoundEnabled(storedSoundEnabled === 'true');
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  // Initialize sounds
  useEffect(() => {
    const loadSounds = async () => {
      try {
        // Load button sound
        const { sound: btnSound } = await Audio.Sound.createAsync(
          require('../assets/sounds/buttonClick.mp3') // ✅ one level up to root, then into assets
        );
        setButtonSound(btnSound);
        
        // Load background music
        const { sound: bgSound } = await Audio.Sound.createAsync(
          require('../assets/sounds/backgroundMusic.mp3'), // ✅ same here
          { isLooping: true }
        );
        setBackgroundSound(bgSound);
        
        // Start playing background music if enabled
        if (soundEnabled) {
          await bgSound.playAsync();
        }
      } catch (error) {
        console.error('Failed to load sounds:', error);
      }
    };
    
    loadSounds();
    
    // Cleanup sounds when unmounting
    return () => {
      const cleanup = async () => {
        if (buttonSound) {
          await buttonSound.unloadAsync();
        }
        if (backgroundSound) {
          await backgroundSound.stopAsync();
          await backgroundSound.unloadAsync();
        }
      };
      
      cleanup();
    };
  }, []);

  // Toggle sound when soundEnabled changes
  useEffect(() => {
    const updateBackgroundSound = async () => {
      if (!backgroundSound) return;
      
      try {
        if (soundEnabled) {
          await backgroundSound.playAsync();
        } else {
          await backgroundSound.pauseAsync();
        }
      } catch (error) {
        console.error('Failed to update background sound:', error);
      }
    };
    
    updateBackgroundSound();
  }, [soundEnabled, backgroundSound]);

  // Update StatusBar when theme changes
  useEffect(() => {
    StatusBar.setBarStyle(themes[theme].statusBar);
  }, [theme]);

  // Toggle theme
  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  // Set language
  const changeLanguage = async (lang: LanguageType) => {
    setLanguage(lang);
    try {
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  // Toggle sound
  const toggleSound = async () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    try {
      await AsyncStorage.setItem('soundEnabled', newSoundEnabled.toString());
    } catch (error) {
      console.error('Failed to save sound setting:', error);
    }
  };

  // Play button sound
  const playButtonSound = async () => {
    if (soundEnabled && buttonSound) {
      try {
        await buttonSound.setPositionAsync(0);
        await buttonSound.playAsync();
      } catch (error) {
        console.error('Failed to play button sound:', error);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage: changeLanguage,
        soundEnabled,
        toggleSound,
        playButtonSound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};