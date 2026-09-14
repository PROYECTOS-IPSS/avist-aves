import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';

import { AppHeader } from '../src/components/AppHeader';
import { AppScreen } from '../src/components/AppScreen';
import { EmptyState } from '../src/components/EmptyState';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { SectionHeader } from '../src/components/SectionHeader';
import { SightingCard } from '../src/components/SightingCard';
import { useSightingsList } from '../src/hooks/useSightingsList';
import type { Sighting, SightingsOrder } from '../src/domain/sightings';
import { SIGHTINGS_ORDER_OPTIONS, sightingsOrderLabel } from '../src/utils/sightingsList';

function LoadingState() {
  return (
    <View className="items-center rounded-3xl border border-field-line bg-field-white p-8">
      <ActivityIndicator color="#193D32" />
      <Text className="mt-3 text-sm font-semibold text-field-muted">Cargando tus avistamientos…</Text>
    </View>
  );
}

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View className="rounded-3xl border border-red-200 bg-field-white p-6">
      <Text className="text-xl font-bold text-field-ink">No pudimos cargar tus avistamientos</Text>
      <Text className="mt-2 text-sm leading-5 text-field-muted">{message}</Text>
      <View className="mt-5">
        <PrimaryButton label="Reintentar" onPress={onRetry} />
      </View>
    </View>
  );
}

export default function SightingsListScreen() {
  const [order, setOrder] = useState<SightingsOrder>('date');
  const { error, load, sightings, status } = useSightingsList(order);
  const renderItem = useCallback(({ item }: { item: Sighting }) => <SightingCard sighting={item} />, []);
  const openRegistration = useCallback(() => router.push('/sightings/new'), []);

  function renderEmptyState() {
    if (status === 'idle' || status === 'loading') return <LoadingState />;
    if (status === 'error') return <ErrorState message={error ?? 'Revisa la base local e inténtalo nuevamente.'} onRetry={() => void load()} />;

    return (
      <EmptyState
        actionLabel="Registrar avistamiento"
        description="Registra tu primera observación con foto, ubicación y clima."
        onAction={openRegistration}
        title="Aún no tienes avistamientos"
      />
    );
  }

  return (
    <AppScreen scroll={false}>
      <FlatList
        data={sightings}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={
          <View>
            <AppHeader
              eyebrow="AvistAves / Cuaderno local"
              title="Tus avistamientos"
              subtitle="Registros reales guardados en este dispositivo, listos para volver a mirar."
            />

            <View className="mb-7 overflow-hidden rounded-3xl bg-field-pine p-6">
              <View className="mb-5 flex-row items-center justify-between">
                <Text className="text-xs font-bold uppercase tracking-[1.5px] text-field-sage">Cuaderno local</Text>
                <Text className="text-sm font-bold text-field-amber">{sightings.length} {sightings.length === 1 ? 'registro' : 'registros'}</Text>
              </View>
              <Text className="max-w-[290px] text-2xl font-bold leading-8 text-field-white">Cada encuentro merece una página.</Text>
              <Text className="mt-3 max-w-[300px] text-sm leading-5 text-field-sage">Añade una observación cuando estés listo para salir al terreno.</Text>
              <View className="mt-6">
                <PrimaryButton label="Registrar avistamiento" onPress={openRegistration} />
              </View>
            </View>

            <View className="mb-4">
              <SectionHeader title="Tus registros" detail={sightingsOrderLabel(order)} />
              <View className="mt-3 flex-row flex-wrap gap-2">
                {SIGHTINGS_ORDER_OPTIONS.map((option) => {
                  const selected = option.value === order;
                  return (
                    <Pressable
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      accessibilityLabel={`Ordenar por ${option.label}`}
                      className={`min-h-12 flex-row items-center rounded-2xl border px-4 py-3 ${selected ? 'border-field-pine bg-field-pine' : 'border-field-line bg-field-white'}`}
                      key={option.value}
                      onPress={() => setOrder(option.value)}
                    >
                      <Text className={`text-sm font-bold ${selected ? 'text-field-white' : 'text-field-ink'}`}>
                        {selected ? '✓ ' : ''}{option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24, flexGrow: sightings.length === 0 ? 1 : undefined }}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      />
    </AppScreen>
  );
}
