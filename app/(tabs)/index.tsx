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
<<<<<<< HEAD
      <Text style={styles.text}>🏠 Welcome to my home </Text>
=======

      <Text style={styles.text}>🏠 Welcome to my app</Text>

>>>>>>> e6b00e7633a125af6838c269a100b65c12fc804e
      <Button title="Start" onPress={handleStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
