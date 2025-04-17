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

  // Load persisted settings first
  useEffect(() => 
    {
    const loadSettings = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        const storedLanguage = await AsyncStorage.getItem('language');
        const storedSoundEnabled = await AsyncStorage.getItem('soundEnabled');
    
        if (storedTheme) setTheme(storedTheme as ThemeType);
        if (storedLanguage) setLanguage(storedLanguage as LanguageType);
        // Only change sound setting if explicitly stored
        if (storedSoundEnabled !== null) {
          setSoundEnabled(storedSoundEnabled === 'true');
        } 
        // Otherwise it remains true (the default value)
    
        // Now load sounds with the current soundEnabled state
        await initializeSounds(storedSoundEnabled === 'true' || storedSoundEnabled === null);
      } catch (error) {
        console.error('Failed to load settings:', error);
        // If settings fail to load, use the default (true)
        await initializeSounds(true);
      }
    };

    loadSettings();

    return () => {
      const cleanup = async () => {
        if (buttonSoundRef.current) {
          await buttonSoundRef.current.unloadAsync();
        }
        if (backgroundSoundRef.current) {
          const status = await backgroundSoundRef.current.getStatusAsync();
          if (status.isLoaded) {
            await backgroundSoundRef.current.stopAsync();
            await backgroundSoundRef.current.unloadAsync();
          }
        }
      };

      cleanup();
    };
  }, []);

  // Initialize sounds function
  const initializeSounds = async (shouldPlayBackground: boolean) => {
    try {
      const { sound: btnSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/buttonClick.mp3')
      );
      buttonSoundRef.current = btnSound;

      const { sound: bgSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/backgroundMusic.mp3'),
        { isLooping: true, volume: 0.5 }
      );
      backgroundSoundRef.current = bgSound;

      // Only play background music if sound is enabled
      if (shouldPlayBackground) {
        await bgSound.playAsync();
      }

      setSoundsLoaded(true);
    } catch (error) {
      console.error('Failed to load sounds:', error);
    }
  };

  // Update background sound when soundEnabled changes
  useEffect(() => {
    const updateBackgroundSound = async () => {
      if (!backgroundSoundRef.current) return;
      
      try {
        const status = await backgroundSoundRef.current.getStatusAsync();
        
        if (status.isLoaded) {
          if (soundEnabled && !status.isPlaying) {
            await backgroundSoundRef.current.playAsync();
          } else if (!soundEnabled && status.isPlaying) {
            await backgroundSoundRef.current.pauseAsync();
          }
        }
      } catch (error) {
        console.error('Failed to update background sound:', error);
      }
    };
    
    if (soundsLoaded) {
      updateBackgroundSound();
    }
  }, [soundEnabled, soundsLoaded]);

  // Toggle sound state
  const toggleSound = async () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    
    try {
      await AsyncStorage.setItem('soundEnabled', newSoundEnabled.toString());
    } catch (error) {
      console.error('Failed to save sound setting:', error);
    }
    
    // Background sound playback is handled by the useEffect above
  };

  // Play button sound
  const playButtonSound = async (): Promise<void> => {
    if (!soundsLoaded || !soundEnabled || !buttonSoundRef.current) return;
    
    try {
      const status = await buttonSoundRef.current.getStatusAsync();
      
      if (status.isLoaded) {
        await buttonSoundRef.current.setPositionAsync(0);
        await buttonSoundRef.current.playAsync();
      }
    } catch (error) {
      console.error('Failed to play button sound:', error);
    }
  };

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