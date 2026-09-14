import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'AvistAves' }} />
      <Stack.Screen name="sightings/new" options={{ title: 'Nuevo avistamiento' }} />
      <Stack.Screen name="sightings/[id]" options={{ title: 'Detalle' }} />
    </Stack>
  );
}
