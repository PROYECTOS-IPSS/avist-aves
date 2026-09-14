import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="sightings/new" />
      <Stack.Screen name="sightings/[id]" />
    </Stack>
  );
}
