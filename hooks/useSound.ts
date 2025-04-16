// src/hooks/useSound.ts
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

export const useSound = (soundFile: any, shouldLoop: boolean = false) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          soundFile,
          { isLooping: shouldLoop }
        );
        setSound(newSound);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load sound:', error);
      }
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [soundFile, shouldLoop]);

  const play = async () => {
    if (sound) {
      try {
        await sound.setPositionAsync(0);
        await sound.playAsync();
      } catch (error) {
        console.error('Failed to play sound:', error);
      }
    }
  };

  const pause = async () => {
    if (sound) {
      try {
        await sound.pauseAsync();
      } catch (error) {
        console.error('Failed to pause sound:', error);
      }
    }
  };

  const stop = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
      } catch (error) {
        console.error('Failed to stop sound:', error);
      }
    }
  };

  return { sound, isLoaded, play, pause, stop };
};