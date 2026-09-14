import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function SightingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center gap-3 bg-white px-6">
      <Text className="text-2xl font-bold text-slate-900">Detalle de avistamiento</Text>
      <Text className="text-base text-slate-600">Identificador de ruta: {id}</Text>
      <Text className="text-center text-sm text-slate-500">
        Los datos reales se incorporarán junto con la persistencia.
      </Text>
    </View>
  );
}
