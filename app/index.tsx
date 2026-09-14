import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function SightingsListScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Text className="text-3xl font-bold text-slate-900">AvistAves</Text>
      <Text className="text-center text-base text-slate-600">
        Registro local de avistamientos de aves.
      </Text>
      <Link href="/sightings/new" asChild>
        <Pressable className="rounded-lg bg-sky-700 px-5 py-3">
          <Text className="font-semibold text-white">Nuevo avistamiento</Text>
        </Pressable>
      </Link>
      <Link href="/sightings/demo" className="text-sky-700 underline">
        Detalle demo de navegación
      </Link>
    </View>
  );
}
