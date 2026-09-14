import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { AppHeader } from '../../src/components/AppHeader';
import { AppScreen } from '../../src/components/AppScreen';
import { FoundationCard } from '../../src/components/FoundationCard';

export default function NewSightingScreen() {
  return (
    <AppScreen>
      <AppHeader
        eyebrow="Nueva ficha / P3 foundation"
        title="Nuevo avistamiento"
        subtitle="Prepara una ficha clara para completar después en el terreno."
        onBack={() => router.back()}
      />

      <FoundationCard
        label="Fotografía"
        title="Captura en terreno"
        description="La cámara será el punto de partida de cada registro."
        mark="□"
        tone="sage"
      />
      <ViewSpacer />
      <FoundationCard
        label="Ubicación"
        title="Punto de observación"
        description="La ubicación del dispositivo aparecerá aquí cuando el flujo esté conectado."
        mark="⌖"
        tone="sky"
      />
      <ViewSpacer />
      <FoundationCard
        label="Observación"
        title="Datos del ave"
        description="Nombre, momento, cantidad y notas tendrán su propio espacio."
        mark="—"
        tone="amber"
      />

      <ViewSpacer large />
      <View className="rounded-3xl bg-field-pine p-5">
        <Text className="text-xs font-bold uppercase tracking-[1.5px] text-field-amber">
          Acción principal
        </Text>
        <Text className="mt-2 text-xl font-bold text-field-white">Guardar avistamiento</Text>
        <Text className="mt-2 text-sm leading-5 text-field-sage">
          Se activará cuando la ficha tenga sus datos funcionales.
        </Text>
      </View>
    </AppScreen>
  );
}

function ViewSpacer({ large = false }: { large?: boolean }) {
  return <View className={large ? 'h-8' : 'h-3'} />;
}
