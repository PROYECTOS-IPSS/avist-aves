import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function NewSightingScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Text className="text-2xl font-bold text-slate-900">Nuevo avistamiento</Text>
      <Text className="text-center text-base text-slate-600">
        La captura y el formulario se incorporarán en fases posteriores.
      </Text>
      <Pressable
        accessibilityRole="button"
        className="rounded-lg border border-slate-300 px-5 py-3"
        onPress={() => router.back()}
      >
        <Text className="font-semibold text-slate-900">Volver</Text>
      </Pressable>
    </View>
  );
}
