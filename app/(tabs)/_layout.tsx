// app/_layout.tsx or app/layout.tsx
import { Slot } from 'expo-router';
import { AppProvider } from '../../contexts/AppContext'; // ✅ adjust if path differs

export default function RootLayout() {
  return (
    <AppProvider>
      <Slot />
    </AppProvider>
  );
}
