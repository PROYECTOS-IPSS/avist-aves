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
  onLocated: (result: LocationCaptureResult) => void;
};

export function LocationCapture({ latitude, longitude, locationLabel, onLocated }: LocationCaptureProps) {
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
    <FormField
      label="Ubicación"
      labelId="location-label"
      required
      helper="Se obtiene automáticamente con el GPS; no se puede escribir a mano."
    >
      <View className={`rounded-3xl p-4 ${hasLocation ? 'bg-field-sage' : 'bg-field-sky'}`}>
        {hasLocation && coordinates ? (
          <>
            <Text className="text-base font-bold text-field-pine">{locationLabel || 'Ubicación obtenida'}</Text>
            <Text className="mt-2 text-sm text-field-pine">
              Lat. {formatCoordinateForDisplay(coordinates.latitude)} · Lon. {formatCoordinateForDisplay(coordinates.longitude)}
            </Text>
          </>
        ) : (
          <Text className="text-sm leading-5 text-field-pine">Necesitamos tu ubicación para registrar dónde observaste el ave.</Text>
        )}
        {error ? (
          <Text accessibilityRole="alert" className="mt-3 text-sm leading-5 text-red-800">
            {error}
          </Text>
        ) : null}
        <View className="mt-4">
          <PrimaryButton disabled={busy} label={actionLabel} onPress={acquireLocation} />
        </View>
        {permissionBlocked ? (
          <Pressable
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
