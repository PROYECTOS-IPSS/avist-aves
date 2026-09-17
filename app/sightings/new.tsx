import { useCallback, useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useCameraPermissions } from 'expo-camera';
import { AppState, Image, Linking, Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';
import type { LayoutChangeEvent, ScrollView } from 'react-native';

import { AppHeader } from '../../src/components/AppHeader';
import { AppScreen } from '../../src/components/AppScreen';
import { FormField } from '../../src/components/FormField';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { SectionHeader } from '../../src/components/SectionHeader';
import { CameraCapture } from '../../src/components/CameraCapture';
import { persistSelectedPhoto } from '../../src/services/photoService';
import { createDraftPhotoLifecycle } from '../../src/services/draftPhotoLifecycle';
import { LocationCapture } from '../../src/components/LocationCapture';
import { useSightingForm } from '../../src/hooks/useSightingForm';
import { SightingsRepository } from '../../src/repositories/SightingsRepository';
import { useWeatherForLocation } from '../../src/hooks/useWeatherForLocation';
import type { LocationCaptureResult } from '../../src/hooks/useLocationCapture';
import { WeatherStatus } from '../../src/components/WeatherStatus';
import { createSightingInput } from '../../src/utils/createSightingInput';
import { requiresMediaLibraryPermission } from '../../src/utils/mediaPermissions';
import {
  formatDraftDate,
  formatDraftDateForDisplay,
  formatDraftTime,
  parseDraftDateTime,
} from '../../src/domain/sightingDraft';
import { BIRD_NAME_MAX_LENGTH, sanitizeBirdName } from '../../src/utils/validateSightingDraft';
import { calculateRequirementScrollOffset } from '../../src/utils/requirementFocus';

const inputClassName = 'min-h-14 rounded-2xl border border-field-line bg-field-white px-4 text-base text-field-ink';
const inputErrorClassName = 'border-red-700';
type SaveStatus = 'idle' | 'saving' | 'success' | 'error';
type PickerMode = 'date' | 'time';
type LayoutBox = { y: number; height: number };
type FocusRequest = { photo: boolean; location: boolean; token: number };

export default function NewSightingScreen() {
  const { draft, errors, setField, touchField, validateForSave } = useSightingForm();
  const [cameraPermission, requestCameraPermission, getCameraPermission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);
  const [cameraPermissionBlocked, setCameraPermissionBlocked] = useState(false);
  const [pickerMode, setPickerMode] = useState<PickerMode | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [galleryPermissionBlocked, setGalleryPermissionBlocked] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);
  const saveInFlightRef = useRef(false);
  const photoUpdateInFlightRef = useRef(false);
  const mountedRef = useRef(false);
  const [draftPhotoLifecycle] = useState(createDraftPhotoLifecycle);
  const scrollRef = useRef<ScrollView>(null);
  const photoLayoutRef = useRef<LayoutBox | null>(null);
  const locationLayoutRef = useRef<LayoutBox | null>(null);
  const viewportHeightRef = useRef(0);
  const contentHeightRef = useRef(0);
  const focusTokenRef = useRef(0);
  const { clearWeather, getWeatherForSave, loadWeather, status: weatherStatus, weather } = useWeatherForLocation();
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (!saveInFlightRef.current) void draftPhotoLifecycle.abandon();
    };
  }, [draftPhotoLifecycle]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void getCameraPermission().then((permission) => {
          if (permission.granted) {
            setCameraPermissionBlocked(false);
            setCameraPermissionError(null);
          }
        });
      }
    });
    return () => subscription.remove();
  }, [getCameraPermission]);
  const focusMissingRequirements = useCallback(() => {
    const request = focusRequest;
    const viewportHeight = viewportHeightRef.current;
    if (!request || viewportHeight <= 0) return;

    const regions = [
      request.photo ? photoLayoutRef.current : null,
      request.location ? locationLayoutRef.current : null,
    ].filter((region): region is LayoutBox => region !== null);
    if (regions.length !== (request.photo ? 1 : 0) + (request.location ? 1 : 0)) return;

    const offset = calculateRequirementScrollOffset(regions, viewportHeight, contentHeightRef.current);
    if (offset !== null) scrollRef.current?.scrollTo({ y: offset, animated: true });
  }, [focusRequest]);

  function handleRequiredLayout(target: 'photo' | 'location', event: LayoutChangeEvent) {
    const box = { y: event.nativeEvent.layout.y, height: event.nativeEvent.layout.height };
    if (target === 'photo') photoLayoutRef.current = box;
    else locationLayoutRef.current = box;
    focusMissingRequirements();
  }

  function requestMissingRequirementFocus(validationErrors: Record<string, string>) {
    const photo = Boolean(validationErrors.photo);
    const location = Boolean(validationErrors.location);
    if (!photo && !location) return;
    focusTokenRef.current += 1;
    setFocusRequest({ photo, location, token: focusTokenRef.current });
  }

  useEffect(() => {
    focusMissingRequirements();
  }, [focusMissingRequirements]);

  async function handleOpenCamera() {
    setCameraPermissionError(null);
    try {
      const currentPermission = cameraPermission ?? await getCameraPermission();
      if (currentPermission.granted) {
        setCameraPermissionBlocked(false);
        setCameraOpen(true);
        return;
      }
      if (!currentPermission.canAskAgain) {
        setCameraPermissionBlocked(true);
        setCameraPermissionError('Sin permiso de cámara no puedes tomar una fotografía del avistamiento. Puedes elegir una imagen de galería.');
        return;
      }
      const requestedPermission = await requestCameraPermission();
      if (requestedPermission.granted) {
        setCameraPermissionBlocked(false);
        setCameraOpen(true);
      } else {
        setCameraPermissionBlocked(!requestedPermission.canAskAgain);
        setCameraPermissionError('Sin permiso de cámara no puedes tomar una fotografía del avistamiento. Puedes elegir una imagen de galería.');
      }
    } catch {
      setCameraPermissionError('No se pudo solicitar el permiso de cámara. Puedes elegir una imagen de galería.');
    }
  }

  async function handleAcceptedPhoto(sourceUri: string) {
    if (saveInFlightRef.current || photoUpdateInFlightRef.current) return;
    photoUpdateInFlightRef.current = true;

    try {
      const persistentUri = await persistSelectedPhoto(sourceUri);
      if (!mountedRef.current || saveInFlightRef.current) {
        await draftPhotoLifecycle.discard(persistentUri);
        return;
      }

      const adopted = await draftPhotoLifecycle.replace(persistentUri);
      if (!adopted || !mountedRef.current) return;

      setField('photoUri', persistentUri);
      setGalleryError(null);
      setCameraPermissionError(null);
      setCameraOpen(false);
    } finally {
      photoUpdateInFlightRef.current = false;
    }
  }

  async function handlePickFromGallery() {
    setGalleryError(null);
    try {
      if (requiresMediaLibraryPermission(Platform.OS)) {
        let permission = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          if (!permission.canAskAgain) {
            setGalleryPermissionBlocked(true);
            setGalleryError('Sin permiso de galería no puedes seleccionar una imagen. La cámara sigue disponible.');
            return;
          }
          permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permission.granted) {
            setGalleryPermissionBlocked(!permission.canAskAgain);
            setGalleryError('Sin permiso de galería no puedes seleccionar una imagen. La cámara sigue disponible.');
            return;
          }
        }
      }

      setGalleryPermissionBlocked(false);
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
      if (mountedRef.current) {
        setGalleryError('No se pudo seleccionar la imagen. Inténtalo nuevamente.');
      }
    }
  }

  async function handleRemovePhoto() {
    if (saveInFlightRef.current || photoUpdateInFlightRef.current) return;
    photoUpdateInFlightRef.current = true;
    setField('photoUri', null);
    setGalleryError(null);

    try {
      await draftPhotoLifecycle.remove();
    } finally {
      photoUpdateInFlightRef.current = false;
    }
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
    if (saveInFlightRef.current || photoUpdateInFlightRef.current || saveStatus === 'success') return;
    saveInFlightRef.current = true;

    setSaveError(null);
    const validationErrors = validateForSave();
    if (Object.keys(validationErrors).length > 0) {
      requestMissingRequirementFocus(validationErrors);
      saveInFlightRef.current = false;
      setSaveStatus('idle');
      return;
    }

    setSaveStatus('saving');
    let persisted = false;
    try {
      const { latitude, longitude } = draft;
      if (latitude === null || longitude === null) {
        if (mountedRef.current) setSaveStatus('idle');
        return;
      }
      const coordinates = { latitude, longitude };
      const currentWeather = await getWeatherForSave(coordinates);
      const input = createSightingInput(draft, currentWeather);
      if (!input.valid) {
        if (mountedRef.current) setSaveStatus('idle');
        return;
      }

      await new SightingsRepository().create(input.value);
      draftPhotoLifecycle.commit();
      persisted = true;
      if (mountedRef.current) setSaveStatus('success');
    } catch {
      if (mountedRef.current) {
        setSaveError('No se pudo guardar el avistamiento. Revisa los datos e inténtalo nuevamente.');
        setSaveStatus('error');
      }
    } finally {
      if (!persisted) {
        saveInFlightRef.current = false;
        if (!mountedRef.current) void draftPhotoLifecycle.abandon();
      }
    }
  }

  const selectedDate = parseDraftDateTime(draft) ?? new Date();

  return (
    <AppScreen
      onContentSizeChange={(_width, height) => {
        contentHeightRef.current = height;
        focusMissingRequirements();
      }}
      onScrollLayout={(event) => {
        viewportHeightRef.current = event.nativeEvent.layout.height;
        focusMissingRequirements();
      }}
      scrollRef={scrollRef}
    >
      <AppHeader
        eyebrow="Nueva ficha / Registro"
        title="Nuevo avistamiento"
        subtitle="Completa lo que sabes ahora. La foto y ubicación quedan en el borrador; clima y guardado final llegarán después."
        onBack={() => router.back()}
      />

      <SectionHeader title="Datos de observación" detail="Borrador" />

      <FormField
        highlightToken={focusRequest?.photo ? focusRequest.token : undefined}
        label="Foto"
        labelId="photo-label"
        onLayout={(event) => handleRequiredLayout('photo', event)}
        required
        error={errors.photo}
      >
        <View className={`rounded-3xl p-4 ${draft.photoUri ? 'bg-field-sage' : 'bg-field-sky'}`}>
          {draft.photoUri ? (
            <>
              <Image
                accessibilityLabel="Fotografía persistente del avistamiento"
                className="h-56 w-full rounded-2xl bg-field-pine"
                resizeMode="contain"
                source={{ uri: draft.photoUri }}
              />
              <Text className="mt-3 text-sm font-bold text-field-pine">Foto lista para el registro</Text>
              <View className="mt-3 gap-3">
                <PrimaryButton label="Repetir foto" onPress={() => void handleOpenCamera()} />
                <Pressable accessibilityLabel="Elegir otra imagen de galería" accessibilityRole="button" className="min-h-12 items-center justify-center rounded-2xl border border-field-pine px-4 py-3" onPress={() => void handlePickFromGallery()}>
                  <Text className="font-bold text-field-pine">Elegir otra de galería</Text>
                </Pressable>
                <Pressable accessibilityRole="button" className="min-h-12 items-center justify-center rounded-2xl border border-field-pine px-4 py-3" onPress={() => void handleRemovePhoto()}>
                  <Text className="font-bold text-field-pine">Eliminar foto</Text>
                </Pressable>
              </View>
            </>
          ) : cameraOpen ? (
            <CameraCapture onAccepted={handleAcceptedPhoto} onCancel={() => setCameraOpen(false)} />
          ) : (
            <>
              <Text className="text-sm leading-5 text-field-pine">Captura una foto o añade una desde tu galería para el registro.</Text>
              {cameraPermissionError ? (
                <Text accessibilityLiveRegion="polite" accessibilityRole="alert" className="mt-3 text-sm leading-5 text-red-800">{cameraPermissionError}</Text>
              ) : null}
              {galleryError ? (
                <Text accessibilityLiveRegion="polite" accessibilityRole="alert" className="mt-3 text-sm leading-5 text-red-800">{galleryError}</Text>
              ) : null}
              <View className="mt-4 gap-3">
                <PrimaryButton accessibilityHint="Solicita permiso y abre la cámara" label="Tomar foto" onPress={() => void handleOpenCamera()} />
                <Pressable accessibilityLabel="Elegir de galería" accessibilityRole="button" className="min-h-14 flex-row items-center justify-between rounded-2xl border border-field-pine bg-field-white px-5 py-4" onPress={() => void handlePickFromGallery()}>
                  <Text className="text-base font-bold text-field-pine">Elegir de galería</Text>
                  <Text className="text-2xl text-field-pine">→</Text>
                </Pressable>
                {cameraPermissionBlocked || galleryPermissionBlocked ? (
                  <Pressable accessibilityHint="Abre los ajustes de permisos del dispositivo" accessibilityRole="button" className="min-h-12 items-center justify-center rounded-2xl border border-field-pine px-4 py-3" onPress={() => Linking.openSettings().catch(() => undefined)}>
                    <Text className="font-bold text-field-pine">Abrir ajustes</Text>
                  </Pressable>
                ) : null}
              </View>
            </>
          )}
        </View>
      </FormField>

      <LocationCapture
        highlightToken={focusRequest?.location ? focusRequest.token : undefined}
        latitude={draft.latitude}
        longitude={draft.longitude}
        locationLabel={draft.locationLabel}
        onLayout={(event) => handleRequiredLayout('location', event)}
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
