import { useState } from 'react';
import { Image, Text, View } from 'react-native';

import type { Sighting } from '../domain/sightings';
import { formatObservedAt, formatTemperature } from '../utils/formatSighting';

type SightingCardProps = {
  sighting: Sighting;
};

export function SightingCard({ sighting }: SightingCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const location = sighting.locationLabel || 'Ubicación no disponible';
  const weather = sighting.weatherDescription || 'Condición no disponible';

  return (
    <View
      accessible
      accessibilityLabel={`Avistamiento de ${sighting.birdName}. ${formatObservedAt(sighting.observedAt)}. ${formatTemperature(sighting.temperature)}.`}
      className="mb-3 flex-row rounded-3xl border border-field-line bg-field-white p-4"
    >
      {imageFailed ? (
        <View className="h-24 w-24 items-center justify-center rounded-2xl bg-field-sage px-2">
          <Text className="text-center text-xs font-bold text-field-pine">Foto no disponible</Text>
        </View>
      ) : (
        <Image
          accessibilityLabel={`Foto de ${sighting.birdName}`}
          className="h-24 w-24 rounded-2xl bg-field-sage"
          onError={() => setImageFailed(true)}
          resizeMode="cover"
          source={{ uri: sighting.photoUri }}
        />
      )}
      <View className="ml-4 flex-1 justify-center">
        <Text className="text-lg font-bold text-field-ink" numberOfLines={1}>
          {sighting.birdName}
        </Text>
        <Text className="mt-1 text-sm font-semibold text-field-moss">{formatObservedAt(sighting.observedAt)}</Text>
        <Text className="mt-1 text-sm text-field-muted" numberOfLines={1}>
          {location}
        </Text>
        <View className="mt-2 flex-row flex-wrap gap-x-3 gap-y-1">
          <Text className="text-xs font-bold text-field-pine">{formatTemperature(sighting.temperature)}</Text>
          <Text className="text-xs text-field-muted">{weather}</Text>
          <Text className="text-xs text-field-muted">{sighting.quantity} {sighting.quantity === 1 ? 'ave' : 'aves'}</Text>
        </View>
      </View>
    </View>
  );
}
