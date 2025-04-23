import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../contexts/AppContext';
import LoadingScreen from './loading';

export default function RootLayout() {
  const { user, loading } = useAuth();
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

  if (loading) {
    return <LoadingScreen />; // 👈 Use your custom screen instead of ActivityIndicator
  }

  return (
    <AppProvider>
      <StatusBar hidden />
      <Slot />
    </AppProvider>
  );
}
