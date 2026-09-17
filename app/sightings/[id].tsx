import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';

import { AppHeader } from '../../src/components/AppHeader';
import { AppScreen } from '../../src/components/AppScreen';
import { ConfirmationModal } from '../../src/components/ConfirmationModal';
import { EmptyState } from '../../src/components/EmptyState';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { useSightingDetail } from '../../src/hooks/useSightingDetail';
import { deleteSighting } from '../../src/services/sightingService';
import { formatCoordinateForDisplay } from '../../src/utils/locationHelpers';
import { formatObservedAt, formatQuantity, formatTemperature } from '../../src/utils/formatSighting';
import { normalizeRouteId } from '../../src/utils/routeParams';
import type { Sighting } from '../../src/domain/sightings';
function DetailLoading() {
  return (
    <View accessibilityLiveRegion="polite" className="items-center rounded-3xl border border-field-line bg-field-white p-8">
      <ActivityIndicator color="#193D32" />
      <Text className="mt-3 text-sm font-semibold text-field-muted">Cargando avistamiento…</Text>
    </View>
  );
}

type DetailErrorProps = {
  message: string;
  onRetry: () => void;
};

function DetailError({ message, onRetry }: DetailErrorProps) {
  return (
    <View className="rounded-3xl border border-red-200 bg-field-white p-6">
      <Text className="text-xl font-bold text-field-ink">No pudimos cargar este avistamiento</Text>
      <Text accessibilityLiveRegion="polite" accessibilityRole="alert" className="mt-2 text-sm leading-5 text-red-800">{message}</Text>
      <View className="mt-5">
        <PrimaryButton accessibilityHint="Vuelve a cargar este avistamiento" label="Reintentar" onPress={() => void onRetry()} />
      </View>
    </View>
  );
}
function SightingDetailContent({ sighting, onDelete }: { sighting: Sighting; onDelete: () => void }) {
  const [imageFailed, setImageFailed] = useState(false);
  const notes = sighting.notes?.trim();
  const locationLabel = sighting.locationLabel?.trim() || 'Ubicación registrada';
  const weatherDescription = sighting.weatherDescription?.trim();
  const hasWeather = sighting.temperature !== null || sighting.humidity !== null || Boolean(weatherDescription);

  return (
    <>
      {imageFailed || !sighting.photoUri ? (
        <View accessible accessibilityLabel="Fotografía no disponible" accessibilityRole="image" className="h-80 items-center justify-center rounded-3xl bg-field-sage px-6">
          <Text className="text-xs font-bold uppercase tracking-[2px] text-field-moss">Fotografía</Text>
          <Text className="mt-3 text-center text-lg font-bold text-field-pine">Foto no disponible</Text>
        </View>
      ) : (
        <Image
          accessibilityLabel={`Fotografía de ${sighting.birdName}`}
          className="h-80 w-full rounded-3xl bg-field-sage"
          onError={() => setImageFailed(true)}
          resizeMode="cover"
          source={{ uri: sighting.photoUri }}
        />
      )}

      <View className="mt-6">
        <Text className="text-4xl font-bold leading-[44px] text-field-ink">{sighting.birdName}</Text>
        <Text className="mt-3 text-base font-semibold text-field-moss">{formatObservedAt(sighting.observedAt)}</Text>
      </View>

      <View className="mt-6 rounded-3xl bg-field-sage p-5">
        <Text className="text-xs font-bold uppercase tracking-[1.5px] text-field-moss">Dónde ocurrió</Text>
        <Text className="mt-2 text-xl font-bold text-field-pine">{locationLabel}</Text>
        <Text className="mt-2 text-sm text-field-moss">
          Coordenadas de referencia · Lat. {formatCoordinateForDisplay(sighting.latitude)} · Lon. {formatCoordinateForDisplay(sighting.longitude)}
        </Text>
      </View>

      <View className="mt-4 rounded-3xl bg-field-sky p-5">
        <Text className="text-xs font-bold uppercase tracking-[1.5px] text-field-moss">Clima histórico</Text>
        {hasWeather ? (
          <>
            {sighting.temperature !== null ? (
              <Text className="mt-2 text-2xl font-bold text-field-pine">{formatTemperature(sighting.temperature)}</Text>
            ) : null}
            {weatherDescription ? <Text className="mt-1 text-base font-bold text-field-pine">{weatherDescription}</Text> : null}
            {sighting.humidity !== null ? (
              <Text className="mt-2 text-sm text-field-pine">Humedad {sighting.humidity.toFixed(0)} %</Text>
            ) : null}
          </>
        ) : (
          <Text className="mt-2 text-base font-bold text-field-pine">Clima no disponible</Text>
        )}
      </View>

      <View className="mt-4 rounded-3xl border border-field-line bg-field-white p-5">
        <Text className="text-xs font-bold uppercase tracking-[1.5px] text-field-muted">Observación</Text>
        <Text className="mt-2 text-lg font-bold text-field-ink">Cantidad observada</Text>
        <Text className="mt-1 text-base text-field-muted">{formatQuantity(sighting.quantity)}</Text>
        {notes ? (
          <>
            <Text className="mt-5 text-lg font-bold text-field-ink">Notas</Text>
            <Text className="mt-1 text-base leading-6 text-field-muted">{notes}</Text>
          </>
        ) : null}
      </View>

      <View className="mt-5">
        <Pressable accessibilityLabel={`Eliminar avistamiento de ${sighting.birdName}`} accessibilityRole="button" className="min-h-12 items-center justify-center rounded-2xl border border-red-800 px-4 py-3" onPress={onDelete}>
          <Text className="font-bold text-red-800">Eliminar avistamiento</Text>
        </Pressable>
      </View>
    </>
  );
}

export default function SightingDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = normalizeRouteId(params.id);
  const { error, load, sighting, status } = useSightingDetail(id);
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!id || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      if (!await deleteSighting(id)) throw new Error('Sighting not found');
      router.replace('/');
    } catch {
      setDeleteError('No se pudo eliminar el avistamiento. Inténtalo nuevamente.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AppScreen>
      <AppHeader
        eyebrow="Ficha / Registro"
        title="Detalle del avistamiento"
        subtitle="La historia persistida de este encuentro con la vida silvestre."
        onBack={() => router.back()}
      />

      {status === 'loading' ? <DetailLoading /> : null}
      {status === 'error' ? <DetailError message={error ?? 'Inténtalo nuevamente.'} onRetry={load} /> : null}
      {status === 'notFound' ? (
        <EmptyState
          actionLabel="Volver al inicio"
          description={id ? 'No existe un registro con este identificador.' : 'La ruta no contiene un identificador válido.'}
          onAction={() => router.replace('/')}
          title="Avistamiento no encontrado"
        />
      ) : null}
      {status === 'success' && sighting ? <SightingDetailContent onDelete={() => { setDeleteError(null); setDeleteRequested(true); }} sighting={sighting} /> : null}
      <ConfirmationModal
        body="Esta acción eliminará el registro de forma permanente y no se puede deshacer."
        busy={deleting}
        error={deleteError}
        onCancel={() => {
          if (!deleting) {
            setDeleteError(null);
            setDeleteRequested(false);
          }
        }}
        onConfirm={() => void confirmDelete()}
        title="¿Eliminar avistamiento?"
        visible={deleteRequested}
      />
    </AppScreen>
  );
}
