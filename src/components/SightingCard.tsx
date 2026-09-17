import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

import type { Sighting } from '../domain/sightings';
import { formatObservedAt, formatQuantity, formatTemperature } from '../utils/formatSighting';

type SightingCardProps = {
  sighting: Sighting;
  onPress?: () => void;
  onDelete?: () => void;
};

export function SightingCard({ sighting, onPress, onDelete }: SightingCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const location = sighting.locationLabel || 'Ubicación no disponible';
  const weather = sighting.weatherDescription || 'Condición no disponible';

  function handleDelete(event: GestureResponderEvent) {
    event.stopPropagation();
    onDelete?.();
  }

  return (
    <Pressable
      accessible
      accessibilityHint={onPress ? 'Abre el detalle del avistamiento' : undefined}
      accessibilityLabel={`Avistamiento de ${sighting.birdName}. ${formatObservedAt(sighting.observedAt)}. ${location}. ${formatTemperature(sighting.temperature)}. ${weather}. ${formatQuantity(sighting.quantity)}.`}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ disabled: !onPress && !onDelete }}
      className="relative mb-3 flex-row rounded-3xl border border-field-line bg-field-white p-4 active:bg-field-sage"
      disabled={!onPress && !onDelete}
      onPress={onPress}
    >
      {imageFailed ? (
        <View accessible={false} className="h-24 w-24 items-center justify-center rounded-2xl bg-field-sage px-2">
          <Text className="text-center text-xs font-bold text-field-pine">Foto no disponible</Text>
        </View>
      ) : (
        <Image
          accessible={false}
          className="h-24 w-24 rounded-2xl bg-field-sage"
          onError={() => setImageFailed(true)}
          resizeMode="cover"
          source={{ uri: sighting.photoUri }}
        />
      )}
      <View className="ml-4 flex-1 justify-center pr-8">
        <Text className="text-lg font-bold text-field-ink" ellipsizeMode="tail" numberOfLines={2}>
          {sighting.birdName}
        </Text>
        <Text className="mt-1 text-sm font-semibold text-field-moss">{formatObservedAt(sighting.observedAt)}</Text>
        <Text className="mt-1 text-sm text-field-muted" ellipsizeMode="tail" numberOfLines={2}>
          {location}
        </Text>
        <View className="mt-2 flex-row flex-wrap gap-x-3 gap-y-1">
          <Text className="text-xs font-bold text-field-pine">{formatTemperature(sighting.temperature)}</Text>
          <Text className="text-xs text-field-muted">{weather}</Text>
          <Text className="text-xs text-field-muted">{formatQuantity(sighting.quantity)}</Text>
        </View>
      </View>
      {onDelete ? (
        <Pressable
          accessibilityLabel={`Eliminar avistamiento de ${sighting.birdName}`}
          accessibilityRole="button"
          className="absolute right-3 top-3 h-11 w-11 items-center justify-center rounded-full border border-field-line bg-field-white active:bg-field-sage"
          hitSlop={4}
          onPress={handleDelete}
        >
          <Text className="text-xl font-bold text-field-moss">×</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}
