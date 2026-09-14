import { useState } from 'react';
import { router } from 'expo-router';
import { Image, Text, TextInput, View } from 'react-native';

import { AppHeader } from '../../src/components/AppHeader';
import { AppScreen } from '../../src/components/AppScreen';
import { FoundationCard } from '../../src/components/FoundationCard';
import { FormField } from '../../src/components/FormField';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { SectionHeader } from '../../src/components/SectionHeader';
import { CameraCapture } from '../../src/components/CameraCapture';
import { deleteOwnedDraftPhoto, persistCapturedPhoto } from '../../src/services/photoService';
import { LocationCapture } from '../../src/components/LocationCapture';
import { useSightingForm } from '../../src/hooks/useSightingForm';

const inputClassName = 'min-h-14 rounded-2xl border border-field-line bg-field-white px-4 text-base text-field-ink';
const inputErrorClassName = 'border-red-700';

export default function NewSightingScreen() {
  const { draft, errors, setField, touchField } = useSightingForm();
  const [cameraOpen, setCameraOpen] = useState(false);

  async function handleAcceptedPhoto(temporaryUri: string) {
    const persistentUri = await persistCapturedPhoto(temporaryUri);
    const replacedUri = draft.photoUri;
    setField('photoUri', persistentUri);
    setCameraOpen(false);
    if (replacedUri) await deleteOwnedDraftPhoto(replacedUri);
  }
  function handleLocated({ coordinates, locationLabel }: { coordinates: { latitude: number; longitude: number }; locationLabel: string }) {
    setField('latitude', coordinates.latitude);
    setField('longitude', coordinates.longitude);
    setField('locationLabel', locationLabel);
  }

  return (
    <AppScreen>
      <AppHeader
        eyebrow="Nueva ficha / Registro"
        title="Nuevo avistamiento"
        subtitle="Completa lo que sabes ahora. La foto y ubicación quedan en el borrador; clima y guardado final llegarán después."
        onBack={() => router.back()}
      />

      <FoundationCard
        label="Fotografía · requerida"
        title={draft.photoUri ? 'Foto lista' : 'Pendiente de cámara'}
        description={draft.photoUri ? 'La fotografía persistente está lista para esta ficha.' : 'Toma la fotografía con la cámara antes de guardar la ficha.'}
        mark={draft.photoUri ? '✓' : '□'}
        tone="sage"
      />
      <View className="h-3" />
      <FoundationCard
        label="Ubicación · requerida"
        title={draft.latitude !== null && draft.longitude !== null ? 'Ubicación lista' : 'Pendiente de GPS'}
        description={
          draft.latitude !== null && draft.longitude !== null
            ? draft.locationLabel || 'Coordenadas obtenidas; nombre de lugar no disponible.'
            : 'La ubicación se obtendrá automáticamente; no se puede editar a mano.'
        }
        mark={draft.latitude !== null && draft.longitude !== null ? '✓' : '⌖'}
        tone="sky"
      />

      <View className="h-8" />
      <SectionHeader title="Datos de observación" detail="Borrador" />

      <FormField
        label="Foto"
        labelId="photo-label"
        required
        helper={draft.photoUri ? undefined : 'Debe tomarse con la cámara del dispositivo; no se permite galería.'}
      >
        {draft.photoUri ? (
          <View className="rounded-3xl bg-field-sage p-4">
            <Image
              accessibilityLabel="Fotografía persistente del avistamiento"
              className="h-56 w-full rounded-2xl bg-field-pine"
              resizeMode="contain"
              source={{ uri: draft.photoUri }}
            />
            <Text className="mt-3 text-sm font-bold text-field-pine">Foto lista para el registro</Text>
            <View className="mt-3">
              <PrimaryButton label="Repetir foto" onPress={() => setCameraOpen(true)} />
            </View>
          </View>
        ) : (
          <PrimaryButton label="Tomar foto" onPress={() => setCameraOpen(true)} />
        )}
        {cameraOpen ? <CameraCapture onAccepted={handleAcceptedPhoto} onCancel={() => setCameraOpen(false)} /> : null}
      </FormField>
      <LocationCapture
        latitude={draft.latitude}
        longitude={draft.longitude}
        locationLabel={draft.locationLabel}
        onLocated={handleLocated}
      />

      <FormField
        label="Nombre del ave"
        labelId="bird-name-label"
        required
        helper="Puedes escribir un nombre común o “No identificada”."
        error={errors.birdName}
      >
        <TextInput
          accessibilityLabel="Nombre del ave"
          accessibilityLabelledBy="bird-name-label"
          autoCapitalize="sentences"
          autoCorrect
          className={`${inputClassName} ${errors.birdName ? inputErrorClassName : ''}`}
          onBlur={() => touchField('birdName')}
          onChangeText={(value) => setField('birdName', value)}
          placeholder="Ej. Chucao"
          placeholderTextColor="#7A8A80"
          returnKeyType="next"
          value={draft.birdName}
        />
      </FormField>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <FormField
            label="Fecha"
            labelId="observed-date-label"
            required
            error={errors.observedAt}
          >
            <TextInput
              accessibilityLabel="Fecha de observación"
              accessibilityLabelledBy="observed-date-label"
              className={`${inputClassName} ${errors.observedAt ? inputErrorClassName : ''}`}
              keyboardType="numbers-and-punctuation"
              onBlur={() => touchField('observedDate')}
              onChangeText={(value) => setField('observedDate', value)}
              placeholder="AAAA-MM-DD"
              placeholderTextColor="#7A8A80"
              value={draft.observedDate}
            />
          </FormField>
        </View>
        <View className="flex-1">
          <FormField label="Hora" labelId="observed-time-label" required helper="HH:MM">
            <TextInput
              accessibilityLabel="Hora de observación"
              accessibilityLabelledBy="observed-time-label"
              className={`${inputClassName} ${errors.observedAt ? inputErrorClassName : ''}`}
              keyboardType="numbers-and-punctuation"
              onBlur={() => touchField('observedTime')}
              onChangeText={(value) => setField('observedTime', value)}
              placeholder="HH:MM"
              placeholderTextColor="#7A8A80"
              value={draft.observedTime}
            />
          </FormField>
        </View>
      </View>

      <FormField
        label="Cantidad"
        labelId="quantity-label"
        required
        helper="Número entero de aves observadas."
        error={errors.quantity}
      >
        <TextInput
          accessibilityLabel="Cantidad de aves"
          accessibilityLabelledBy="quantity-label"
          className={`${inputClassName} ${errors.quantity ? inputErrorClassName : ''}`}
          keyboardType="number-pad"
          onBlur={() => touchField('quantity')}
          onChangeText={(value) => setField('quantity', value)}
          placeholder="1"
          placeholderTextColor="#7A8A80"
          value={draft.quantity}
        />
      </FormField>

      <FormField label="Notas" labelId="notes-label" helper="Opcional">
        <TextInput
          accessibilityLabel="Notas del avistamiento"
          accessibilityLabelledBy="notes-label"
          className={`${inputClassName} min-h-28 pt-4`}
          multiline
          numberOfLines={4}
          onChangeText={(value) => setField('notes', value)}
          placeholder="Anota comportamiento, hábitat u otra observación."
          placeholderTextColor="#7A8A80"
          style={{ textAlignVertical: 'top' }}
          value={draft.notes}
        />
      </FormField>

      <View className="mt-2 rounded-3xl bg-field-pine p-5">
        <Text className="text-xs font-bold uppercase tracking-[1.5px] text-field-amber">
          Guardado pendiente
        </Text>
        <Text className="mt-2 text-xl font-bold text-field-white">La ficha aún no está lista</Text>
        <Text className="mt-2 mb-4 text-sm leading-5 text-field-sage">
          La foto y ubicación se conservan en el borrador; el clima y guardado final se conectarán después.
        </Text>
        <PrimaryButton label="Guardar avistamiento" disabled />
      </View>
    </AppScreen>
  );
}
