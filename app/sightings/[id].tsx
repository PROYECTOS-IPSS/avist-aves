import { useLocalSearchParams, router } from 'expo-router';
import { Text, View } from 'react-native';

import { AppHeader } from '../../src/components/AppHeader';
import { AppScreen } from '../../src/components/AppScreen';
import { FoundationCard } from '../../src/components/FoundationCard';

export default function SightingDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  return (
    <AppScreen>
      <AppHeader
        eyebrow="Ficha / Detail foundation"
        title="Detalle del avistamiento"
        subtitle="Una vista preparada para reunir la historia completa de cada encuentro."
        onBack={() => router.back()}
      />

      <View className="h-64 items-center justify-center rounded-3xl bg-field-sage">
        <Text className="text-xs font-bold uppercase tracking-[2px] text-field-moss">Fotografía</Text>
        <Text className="mt-3 text-lg font-bold text-field-pine">Imagen del registro</Text>
        <Text className="mt-1 text-sm text-field-muted">Se conectará en una fase posterior.</Text>
      </View>

      <View className="mt-4 rounded-3xl border border-field-line bg-field-white p-5">
        <Text className="text-xs font-bold uppercase tracking-[1.5px] text-field-muted">
          Identificador de ruta
        </Text>
        <Text className="mt-2 font-mono text-base text-field-ink">{id || 'Sin identificador'}</Text>
      </View>

      <View className="mt-4">
        <FoundationCard
          label="Contenido pendiente"
          title="Detalle preparado"
          description="Los datos reales llegarán desde SightingsRepository cuando se conecte esta pantalla."
          mark="i"
          tone="sky"
        />
      </View>
    </AppScreen>
  );
}
