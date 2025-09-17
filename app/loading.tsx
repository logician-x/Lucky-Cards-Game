// app/loading.tsx
import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('../(tabs)/login'); // navigate to login after 3 seconds
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#1A2C38', '#0D1821']}
      style={styles.container}
    >
      {/* You would replace this with your actual logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Cards Game</Text>
        <Text style={styles.tagline}>Your Ultimate Cards Game</Text>
      </View>
      
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Preparing your odds...</Text>
      </View>
      
      <Text style={styles.footerText}>Enjoy your game!</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 16,
    color: '#BDBDBD',
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '500',
  },
  footerText: {
    position: 'absolute',
    bottom: 50,
    color: '#FFFFFF',
    opacity: 0.7,
    fontSize: 16,
  }
});