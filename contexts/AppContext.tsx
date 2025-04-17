// src/contexts/AppContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { StatusBar } from 'react-native';
import { themes } from '../styles/theme';

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
  soundsLoaded: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [language, setLanguage] = useState<LanguageType>('english');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [soundsLoaded, setSoundsLoaded] = useState<boolean>(false);

  const backgroundSoundRef = useRef<Audio.Sound | null>(null);
  const buttonSoundRef = useRef<Audio.Sound | null>(null);

  // Load persisted settings
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

  // Load sounds
  useEffect(() => {
    const loadSounds = async () => {
      try {
        const { sound: btnSound } = await Audio.Sound.createAsync(
          require('../assets/sounds/buttonClick.mp3')
        );
        buttonSoundRef.current = btnSound;

        const { sound: bgSound } = await Audio.Sound.createAsync(
          require('../assets/sounds/backgroundMusic.mp3'),
          { isLooping: true }
        );
        backgroundSoundRef.current = bgSound;

        if (soundEnabled) {
          const status = await bgSound.getStatusAsync();
          if (status.isLoaded && !status.isPlaying) {
            await bgSound.playAsync();
          }
          
        }

        setSoundsLoaded(true);
      } catch (error) {
        console.error('Failed to load sounds:', error);
      }
    };

    loadSounds();

    return () => {
      const cleanup = async () => {
        if (buttonSoundRef.current) {
          await buttonSoundRef.current.unloadAsync();
        }
        if (backgroundSoundRef.current) {
          await backgroundSoundRef.current.stopAsync();
          await backgroundSoundRef.current.unloadAsync();
        }
      };

      cleanup();
    };
  }, []);

  // Toggle sound
  const toggleSound = async () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
  
    try {
      await AsyncStorage.setItem('soundEnabled', newSoundEnabled.toString());
  
      const bgSound = backgroundSoundRef.current;
      if (bgSound) {
        const status = await bgSound.getStatusAsync();
  
        if ('isLoaded' in status && status.isLoaded) {
          if (newSoundEnabled && !status.isPlaying) {
            await bgSound.playAsync();
          } else if (!newSoundEnabled && status.isPlaying) {
            await bgSound.pauseAsync();
          }
        }
      }
    } catch (error) {
      console.error('Failed to toggle sound:', error);
    }
  };
  

  // Play button sound
  const playButtonSound = async () => {
    if (soundEnabled && buttonSoundRef.current) {
      try {
        await buttonSoundRef.current.setPositionAsync(0);
        await buttonSoundRef.current.playAsync();
      } catch (error) {
        console.error('Failed to play button sound:', error);
      }
    }
  };

  // Update status bar on theme change
  useEffect(() => {
    StatusBar.setBarStyle(themes[theme].statusBar);
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const changeLanguage = async (lang: LanguageType) => {
    setLanguage(lang);
    await AsyncStorage.setItem('language', lang);
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
        soundsLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
