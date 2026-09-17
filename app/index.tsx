import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';

import { AppHeader } from '../src/components/AppHeader';
import { AppScreen } from '../src/components/AppScreen';
import { ConfirmationModal } from '../src/components/ConfirmationModal';
import { EmptyState } from '../src/components/EmptyState';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { SectionHeader } from '../src/components/SectionHeader';
import { SightingCard } from '../src/components/SightingCard';
import { useSightingsList } from '../src/hooks/useSightingsList';
import type { Sighting, SightingsSort } from '../src/domain/sightings';
import { deleteSighting } from '../src/services/sightingService';
import { SIGHTINGS_ORDER_OPTIONS, sightingsOrderLabel } from '../src/utils/sightingsList';

function LoadingState() {
  return (
    <View accessibilityLiveRegion="polite" className="items-center rounded-3xl border border-field-line bg-field-white p-8">
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
      <Text accessibilityLiveRegion="polite" accessibilityRole="alert" className="mt-2 text-sm leading-5 text-red-800">{message}</Text>
      <View className="mt-5">
        <PrimaryButton accessibilityHint="Vuelve a cargar tus avistamientos" label="Reintentar" onPress={onRetry} />
      </View>
    </View>
  );
}
export default function SightingsListScreen() {
  const [sort, setSort] = useState<SightingsSort>({ field: 'date', direction: 'desc' });
  const [pendingDelete, setPendingDelete] = useState<Sighting | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { error, load, sightings, status } = useSightingsList(sort);
  const openRegistration = useCallback(() => router.push('/sightings/new'), []);
  const openDetail = useCallback((id: string) => {
    const normalizedId = id.trim();
    if (!normalizedId) return;
    router.push(`/sightings/${encodeURIComponent(normalizedId)}`);
  }, []);
  const requestDelete = useCallback((sighting: Sighting) => {
    setDeleteError(null);
    setPendingDelete(sighting);
  }, []);

  async function confirmDelete() {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      if (!await deleteSighting(pendingDelete.id)) throw new Error('Sighting not found');
      setPendingDelete(null);
      await load();
    } catch {
      setDeleteError('No se pudo eliminar el avistamiento. Inténtalo nuevamente.');
    } finally {
      setDeleting(false);
    }
  }

  const renderItem = useCallback(
    ({ item }: { item: Sighting }) => (
      <SightingCard onDelete={() => requestDelete(item)} onPress={item.id.trim() ? () => openDetail(item.id) : undefined} sighting={item} />
    ),
    [openDetail, requestDelete],
  );

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
                <PrimaryButton accessibilityHint="Abre el formulario para registrar un avistamiento" label="Registrar avistamiento" onPress={openRegistration} />
              </View>
            </View>

            <View className="mb-4">
              <SectionHeader title="Tus registros" detail={status === 'loading' ? 'Actualizando…' : sightingsOrderLabel(sort)} />
              <View accessibilityLabel="Orden de registros" accessibilityRole="radiogroup" className="mt-3 flex-row flex-wrap gap-2">
                {SIGHTINGS_ORDER_OPTIONS.map((option) => {
                  const selected = option.value === sort.field;
                  const label = selected ? sightingsOrderLabel(sort) : option.label;
                  return (
                    <Pressable
                      accessibilityHint={selected ? 'Orden seleccionado' : 'Selecciona este orden'}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      accessibilityLabel={`Ordenar por ${label}`}
                      className={`min-h-12 flex-row items-center rounded-2xl border px-4 py-3 ${selected ? 'border-field-pine bg-field-pine' : 'border-field-line bg-field-white'}`}
                      key={option.value}
                      onPress={() => setSort((current) => current.field === option.value && option.value !== 'date'
                        ? { ...current, direction: current.direction === 'asc' ? 'desc' : 'asc' }
                        : { field: option.value, direction: option.value === 'name' ? 'asc' : 'desc' })}
                    >
                      <Text className={`text-sm font-bold ${selected ? 'text-field-white' : 'text-field-ink'}`}>
                        {selected ? '✓ ' : ''}{label}
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
      <ConfirmationModal
        body="Esta acción eliminará el registro de forma permanente y no se puede deshacer."
        busy={deleting}
        error={deleteError}
        onCancel={() => {
          if (!deleting) {
            setDeleteError(null);
            setPendingDelete(null);
          }
        }}
        onConfirm={() => void confirmDelete()}
        title="¿Eliminar avistamiento?"
        visible={pendingDelete !== null}
      />
    </AppScreen>
  );
}
