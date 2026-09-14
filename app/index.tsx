import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { AppHeader } from '../src/components/AppHeader';
import { AppScreen } from '../src/components/AppScreen';
import { EmptyState } from '../src/components/EmptyState';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { SectionHeader } from '../src/components/SectionHeader';

export default function SightingsListScreen() {
  return (
    <AppScreen>
      <AppHeader
        eyebrow="AvistAves / Field notebook"
        title="Observa. Registra. Recuerda."
        subtitle="Un cuaderno de campo para guardar cada encuentro con la vida silvestre."
      />

      <View className="mb-8 overflow-hidden rounded-3xl bg-field-pine p-6">
        <View className="mb-8 flex-row items-center justify-between">
          <Text className="text-xs font-bold uppercase tracking-[1.5px] text-field-sage">
            Listo para salir
          </Text>
          <View className="h-3 w-3 rounded-full bg-field-amber" />
        </View>
        <Text className="max-w-[270px] text-2xl font-bold leading-8 text-field-white">
          Tu próximo registro empieza aquí.
        </Text>
        <Text className="mt-3 max-w-[300px] text-sm leading-5 text-field-sage">
          Toma nota del momento. La ficha completa se construirá paso a paso.
        </Text>
        <View className="mt-6">
          <PrimaryButton label="Registrar avistamiento" onPress={() => router.push('/sightings/new')} />
        </View>
      </View>

      <SectionHeader title="Tus avistamientos" detail="Cuaderno local" />
      <EmptyState
        title="Todavía no hay registros"
        description="Cuando encuentres un ave, usa el botón principal para abrir una nueva ficha de campo."
      />

      <View className="mt-6 border-l-2 border-field-amber pl-4">
        <Text className="text-sm font-semibold leading-5 text-field-ink">Diseñado para el terreno</Text>
        <Text className="mt-1 text-sm leading-5 text-field-muted">
          Lectura clara, acciones grandes y poco ruido visual mientras estás en movimiento.
        </Text>
      </View>
    </AppScreen>
  );
}
