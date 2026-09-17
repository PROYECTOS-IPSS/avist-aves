import { Linking, Pressable, Text, View } from 'react-native';

import { useLocationCapture, type LocationCaptureResult } from '../hooks/useLocationCapture';
import {
  formatCoordinateForDisplay,
  isValidCoordinates,
  type LocationCoordinates,
} from '../utils/locationHelpers';
import { FormField } from './FormField';
import { PrimaryButton } from './PrimaryButton';

type LocationCaptureProps = {
  latitude: number | null;
  longitude: number | null;
  locationLabel: string | null;
  validationError?: string;
  onLocated: (result: LocationCaptureResult) => void;
  onClear: () => void;
};

export function LocationCapture({ latitude, longitude, locationLabel, validationError, onLocated, onClear }: LocationCaptureProps) {
  const { acquireLocation, error, permissionBlocked, status } = useLocationCapture(onLocated);
  const hasLocation =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    isValidCoordinates(latitude, longitude);
  const busy = status === 'requestingPermission' || status === 'acquiring';
  const coordinates: LocationCoordinates | null = hasLocation ? { latitude, longitude } : null;
  const actionLabel = busy
    ? status === 'requestingPermission'
      ? 'Solicitando permiso…'
      : 'Obteniendo ubicación…'
    : hasLocation
      ? 'Actualizar ubicación'
      : 'Obtener ubicación';

  return (
    <FormField label="Ubicación" labelId="location-label" required error={validationError}>
      <View className={`rounded-3xl p-4 ${hasLocation ? 'bg-field-sage' : 'bg-field-sky'}`}>
        {hasLocation && coordinates ? (
          <>
            <Text accessibilityLiveRegion="polite" className="text-base font-bold text-field-pine">{locationLabel || 'Ubicación obtenida'}</Text>
            <Text className="mt-2 text-sm text-field-pine">
              Lat. {formatCoordinateForDisplay(coordinates.latitude)} · Lon. {formatCoordinateForDisplay(coordinates.longitude)}
            </Text>
          </>
        ) : (
          <Text className="text-sm leading-5 text-field-pine">Necesitamos tu ubicación para registrar dónde observaste el ave.</Text>
        )}
        {error ? (
          <Text accessibilityLiveRegion="polite" accessibilityRole="alert" className="mt-3 text-sm leading-5 text-red-800">
            {error}
          </Text>
        ) : null}
        <View className="mt-4">
          <PrimaryButton accessibilityHint="Obtiene o actualiza el lugar de observación" disabled={busy} label={actionLabel} onPress={acquireLocation} />
        </View>
        {hasLocation ? (
          <Pressable accessibilityLabel="Eliminar ubicación" accessibilityRole="button" className="mt-3 min-h-12 items-center justify-center rounded-2xl border border-field-pine px-4 py-3" onPress={onClear}>
            <Text className="font-bold text-field-pine">Eliminar ubicación</Text>
          </Pressable>
        ) : null}
        {permissionBlocked ? (
          <Pressable
            accessibilityHint="Abre los ajustes de permisos del dispositivo"
            accessibilityRole="button"
            className="mt-3 min-h-12 items-center justify-center rounded-2xl border border-field-pine px-4 py-3"
            onPress={() => Linking.openSettings().catch(() => undefined)}
          >
            <Text className="font-bold text-field-pine">Abrir ajustes</Text>
          </Pressable>
        ) : null}
      </View>
    </FormField>
  );
}
