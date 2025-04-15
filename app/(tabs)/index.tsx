// app/(tabs)/index.tsx
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/(tabs)/Dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏠 Welcome to my app</Text>
      <Button title="Start" onPress={handleStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
