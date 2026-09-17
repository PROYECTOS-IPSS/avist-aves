import { useRef, useState } from 'react';
import { router } from 'expo-router';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Image, Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { AppHeader } from '../../src/components/AppHeader';
import { AppScreen } from '../../src/components/AppScreen';
import { FormField } from '../../src/components/FormField';
import { FormInfo } from '../../src/components/FormInfo';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { SectionHeader } from '../../src/components/SectionHeader';
import { CameraCapture } from '../../src/components/CameraCapture';
import { deleteOwnedDraftPhoto, persistSelectedPhoto } from '../../src/services/photoService';
import { LocationCapture } from '../../src/components/LocationCapture';
import { useSightingForm } from '../../src/hooks/useSightingForm';
import { SightingsRepository } from '../../src/repositories/SightingsRepository';
import { useWeatherForLocation } from '../../src/hooks/useWeatherForLocation';
import type { LocationCaptureResult } from '../../src/hooks/useLocationCapture';
import { WeatherStatus } from '../../src/components/WeatherStatus';
import { createSightingInput } from '../../src/utils/createSightingInput';
import {
  formatDraftDate,
  formatDraftDateForDisplay,
  formatDraftTime,
  parseDraftDateTime,
} from '../../src/domain/sightingDraft';
import { BIRD_NAME_MAX_LENGTH, sanitizeBirdName } from '../../src/utils/validateSightingDraft';

const inputClassName = 'min-h-14 rounded-2xl border border-field-line bg-field-white px-4 text-base text-field-ink';
const inputErrorClassName = 'border-red-700';
type SaveStatus = 'idle' | 'saving' | 'success' | 'error';
type PickerMode = 'date' | 'time';

export default function NewSightingScreen() {
  const { draft, errors, setField, touchField, validateForSave } = useSightingForm();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<PickerMode | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveInFlightRef = useRef(false);
  const { clearWeather, getWeatherForSave, loadWeather, status: weatherStatus, weather } = useWeatherForLocation();

  async function handleAcceptedPhoto(sourceUri: string) {
    const persistentUri = await persistSelectedPhoto(sourceUri);
    const replacedUri = draft.photoUri;
    setField('photoUri', persistentUri);
    setGalleryError(null);
    setCameraOpen(false);
    if (replacedUri) await deleteOwnedDraftPhoto(replacedUri);
  }

  async function handlePickFromGallery() {
    setGalleryError(null);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setGalleryError('Necesitamos permiso de galería para seleccionar una imagen. Puedes usar la cámara igualmente.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        allowsMultipleSelection: false,
        quality: 0.85,
      });
      if (result.canceled) return;

      const sourceUri = result.assets[0]?.uri;
      if (!sourceUri) {
        setGalleryError('No se encontró una imagen seleccionable. Inténtalo nuevamente.');
        return;
      }
      await handleAcceptedPhoto(sourceUri);
    } catch {
      setGalleryError('No se pudo seleccionar la imagen. Inténtalo nuevamente.');
    }
  }

  async function handleRemovePhoto() {
    const photoUri = draft.photoUri;
    setField('photoUri', null);
    setGalleryError(null);
    if (photoUri) await deleteOwnedDraftPhoto(photoUri);
  }

  function applyPickerValue(mode: PickerMode, selectedDate: Date) {
    if (mode === 'date') setField('observedDate', formatDraftDate(selectedDate));
    else setField('observedTime', formatDraftTime(selectedDate));
    setPickerMode(null);
  }

  function openPicker(mode: PickerMode) {
    touchField(mode === 'date' ? 'observedDate' : 'observedTime');
    const now = new Date();
    const draftValue = parseDraftDateTime(draft) ?? now;
    const value = mode === 'date' && draftValue > now ? now : draftValue;
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        mode,
        value,
        ...(mode === 'date' ? { maximumDate: now } : {}),
        is24Hour: true,
        onValueChange: (_event, selectedDate) => applyPickerValue(mode, selectedDate),
        onDismiss: () => setPickerMode(null),
      });
      return;
    }
    setPickerMode(mode);
  }


  function handleLocated({ coordinates, locationLabel }: LocationCaptureResult) {
    setField('latitude', coordinates.latitude);
    setField('longitude', coordinates.longitude);
    setField('locationLabel', locationLabel);
    void loadWeather(coordinates);
  }

  function handleRemoveLocation() {
    setField('latitude', null);
    setField('longitude', null);
    setField('locationLabel', null);
    clearWeather();
  }

  async function handleSave() {
    if (saveInFlightRef.current || saveStatus === 'success') return;
    saveInFlightRef.current = true;

    setSaveError(null);
    const validationErrors = validateForSave();
    if (Object.keys(validationErrors).length > 0) {
      saveInFlightRef.current = false;
      setSaveStatus('idle');
      return;
    }

    setSaveStatus('saving');
    try {
      const { latitude, longitude } = draft;
      if (latitude === null || longitude === null) {
        saveInFlightRef.current = false;
        setSaveStatus('idle');
        return;
      }
      const coordinates = { latitude, longitude };
      const currentWeather = await getWeatherForSave(coordinates);
      const input = createSightingInput(draft, currentWeather);
      if (!input.valid) {
        saveInFlightRef.current = false;
        setSaveStatus('idle');
        return;
      }

      await new SightingsRepository().create(input.value);
      setSaveStatus('success');
    } catch {
      saveInFlightRef.current = false;
      setSaveError('No se pudo guardar el avistamiento. Revisa los datos e inténtalo nuevamente.');
      setSaveStatus('error');
    }
  }

  const selectedDate = parseDraftDateTime(draft) ?? new Date();

  return (
    <AppScreen>
      <AppHeader
        eyebrow="Nueva ficha / Registro"
        title="Nuevo avistamiento"
        subtitle="Completa lo que sabes ahora. La foto y ubicación quedan en el borrador; clima y guardado final llegarán después."
        onBack={() => router.back()}
      />

      <SectionHeader title="Datos de observación" detail="Borrador" />

      <FormField label="Foto" labelId="photo-label" required error={errors.photo}>
        {draft.photoUri ? (
          <View className="rounded-3xl bg-field-sage p-4">
            <Image
              accessibilityLabel="Fotografía persistente del avistamiento"
              className="h-56 w-full rounded-2xl bg-field-pine"
              resizeMode="contain"
              source={{ uri: draft.photoUri }}
            />
            <Text className="mt-3 text-sm font-bold text-field-pine">Foto lista para el registro</Text>
            <View className="mt-3 gap-3">
              <PrimaryButton label="Repetir foto" onPress={() => setCameraOpen(true)} />
              <Pressable accessibilityRole="button" className="min-h-12 items-center justify-center rounded-2xl border border-field-pine px-4 py-3" onPress={() => void handleRemovePhoto()}>
                <Text className="font-bold text-field-pine">Eliminar foto</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          !cameraOpen ? (
            <View className="gap-3">
              <FormInfo message="Captura una foto o añade una desde tu galería para el registro." />
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <PrimaryButton label="Tomar foto" onPress={() => setCameraOpen(true)} />
                </View>
                <View className="flex-1">
                  <Pressable accessibilityLabel="Elegir de galería" accessibilityRole="button" className="min-h-14 flex-row items-center justify-between rounded-2xl border border-field-pine bg-field-white px-5 py-4" onPress={() => void handlePickFromGallery()}>
                    <Text className="text-base font-bold text-field-pine">Elegir de galería</Text>
                    <Text className="text-2xl text-field-pine">→</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : null
        )}
        {cameraOpen ? <CameraCapture onAccepted={handleAcceptedPhoto} onCancel={() => setCameraOpen(false)} /> : null}
        {galleryError ? (
          <Text accessibilityLiveRegion="polite" accessibilityRole="alert" className="mt-2 text-sm leading-5 text-red-800">
            {galleryError}
          </Text>
        ) : null}
      </FormField>

      <LocationCapture
        latitude={draft.latitude}
        longitude={draft.longitude}
        locationLabel={draft.locationLabel}
        validationError={errors.location}
        onLocated={handleLocated}
        onClear={handleRemoveLocation}
      />
      <WeatherStatus status={weatherStatus} weather={weather} />

      <FormField
        label="Nombre del ave"
        labelId="bird-name-label"
        required
        error={errors.birdName}
      >
        <TextInput
          accessibilityLabel="Nombre del ave"
          accessibilityLabelledBy="bird-name-label"
          autoCapitalize="sentences"
          autoCorrect
          className={`${inputClassName} ${errors.birdName ? inputErrorClassName : ''}`}
          maxLength={BIRD_NAME_MAX_LENGTH}
          onBlur={() => touchField('birdName')}
          onChangeText={(value) => setField('birdName', sanitizeBirdName(value))}
          placeholder="Ej. Chucao"
          placeholderTextColor="#7A8A80"
          returnKeyType="next"
          value={draft.birdName}
        />
        <Text accessibilityLiveRegion="polite" className="mt-2 text-right text-xs text-field-muted">
          {Array.from(draft.birdName).length} / {BIRD_NAME_MAX_LENGTH}
        </Text>
      </FormField>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <FormField label="Fecha" labelId="observed-date-label" required error={errors.observedAt}>
            <Pressable
              accessibilityLabel="Fecha de observación"
              accessibilityLabelledBy="observed-date-label"
              accessibilityRole="button"
              className={`${inputClassName} justify-center ${errors.observedAt ? inputErrorClassName : ''}`}
              onPress={() => openPicker('date')}
            >
              <Text className="text-base text-field-ink">{formatDraftDateForDisplay(selectedDate)}</Text>
            </Pressable>
          </FormField>
        </View>
        <View className="flex-1">
          <FormField label="Hora" labelId="observed-time-label" required error={errors.observedAt}>
            <Pressable
              accessibilityLabel="Hora de observación"
              accessibilityLabelledBy="observed-time-label"
              accessibilityRole="button"
              className={`${inputClassName} justify-center ${errors.observedAt ? inputErrorClassName : ''}`}
              onPress={() => openPicker('time')}
            >
              <Text className="text-base text-field-ink">{draft.observedTime}</Text>
            </Pressable>
          </FormField>
        </View>
      </View>

      {Platform.OS !== 'android' && pickerMode ? (
        <DateTimePicker
          mode={pickerMode}
          value={selectedDate}
          maximumDate={pickerMode === 'date' ? new Date() : undefined}
          is24Hour
          onValueChange={(_event, date) => applyPickerValue(pickerMode, date)}
          onDismiss={() => setPickerMode(null)}
        />
      ) : null}

      <FormField label="Cantidad" labelId="quantity-label" required helper="Número entero de aves observadas." error={errors.quantity}>
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
        <Text accessibilityLiveRegion="polite" className="text-xs font-bold uppercase tracking-[1.5px] text-field-amber">
          {saveStatus === 'success' ? 'Guardado correcto' : saveStatus === 'error' ? 'No se pudo guardar' : 'Registro'}
        </Text>
        <Text className="mt-2 text-xl font-bold text-field-white">
          {saveStatus === 'success' ? 'Avistamiento guardado' : saveStatus === 'error' ? 'Guardar nuevamente' : 'Guardar avistamiento'}
        </Text>
        <Text accessibilityLiveRegion="polite" accessibilityRole={saveError ? 'alert' : undefined} className="mt-2 mb-4 text-sm leading-5 text-field-sage">
          {saveError || 'El clima es opcional; foto, ubicación y datos válidos son necesarios para guardar.'}
        </Text>
        <PrimaryButton
          accessibilityHint={saveStatus === 'saving' ? 'Espera mientras se guarda el registro' : 'Guarda el avistamiento'}
          busy={saveStatus === 'saving'}
          disabled={saveStatus === 'saving' || saveStatus === 'success'}
          label={saveStatus === 'saving' ? 'Guardando…' : saveStatus === 'success' ? 'Guardado' : 'Guardar avistamiento'}
          onPress={() => void handleSave()}
        />
      </View>

      <Modal accessibilityViewIsModal animationType="fade" transparent visible={saveStatus === 'success'} onRequestClose={() => undefined}>
        <View className="flex-1 justify-center bg-black/50 px-6">
          <View accessible accessibilityRole="alert" className="rounded-3xl bg-field-white p-6">
            <Text accessibilityLabel="Guardado correcto" className="text-3xl font-bold text-field-pine">✓</Text>
            <Text className="mt-3 text-2xl font-bold text-field-ink">Avistamiento guardado</Text>
            <Text className="mt-2 mb-5 text-base leading-6 text-field-muted">El registro se guardó correctamente.</Text>
            <PrimaryButton label="Continuar" onPress={() => router.replace('/')} />
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}
