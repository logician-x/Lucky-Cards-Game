import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { user, loading } = useAuth(); // Get user and loading status
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inTabsGroup = segments[0] === '(tabs)';

    if (!user && inTabsGroup) {
      router.replace('/login');
    } else if (user && !inTabsGroup) {
      router.replace('/(tabs)');
    }
  }, [user, segments, loading]);

  // 👇 THIS is the key: prevent any screen rendering until auth is done
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }
  
  return (
    <>
      <StatusBar hidden />
      <Slot />
    </>
  );
}
