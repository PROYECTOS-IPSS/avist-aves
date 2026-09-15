import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Image, Linking, Pressable, Text, View } from 'react-native';
import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { PrimaryButton } from './PrimaryButton';
import { permissionRecoveryState } from '../utils/permissionState';

type CameraCaptureProps = {
  onAccepted: (temporaryUri: string) => Promise<void>;
  onCancel: () => void;
};

type CameraStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error';

export function CameraCapture({ onAccepted, onCancel }: CameraCaptureProps) {
  const [permission, requestPermission, getPermission] = useCameraPermissions();
  const [status, setStatus] = useState<CameraStatus>('idle');
  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [temporaryUri, setTemporaryUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') void getPermission();
    });
    return () => subscription.remove();
  }, [getPermission]);
  const cameraStatus =
    !permission || status === 'requesting' || status === 'error'
      ? status
      : permission.granted
        ? 'granted'
        : 'denied';


  async function handleRequestPermission() {
    setStatus('requesting');
    setError(null);

    try {
      const result = await requestPermission();
      setStatus(result.granted ? 'granted' : 'denied');
    } catch {
      setStatus('error');
      setError('No se pudo solicitar el permiso de cámara. Inténtalo nuevamente.');
    }
  }

  async function handleCapture() {
    if (capturing) return;

    const camera = cameraRef.current;
    if (!camera) {
      setError('La cámara aún no está disponible. Espera un momento e inténtalo nuevamente.');
      return;
    }

    setCapturing(true);
    setError(null);

    try {
      const picture = await camera.takePictureAsync({ quality: 0.75, skipProcessing: false });
      if (!picture?.uri) throw new Error('La cámara no devolvió una imagen.');
      setTemporaryUri(picture.uri);
    } catch {
      setError('No se pudo capturar la fotografía. Puedes intentarlo nuevamente.');
    } finally {
      setCapturing(false);
    }
  }

  async function handleAccept() {
    if (!temporaryUri || accepting) return;

    setAccepting(true);
    setError(null);
    try {
      await onAccepted(temporaryUri);
    } catch {
      setError('No se pudo guardar la fotografía. Inténtalo nuevamente.');
    } finally {
      setAccepting(false);
    }
  }

  if (!permission) {
    return (
      <View className="mt-3 items-center rounded-3xl bg-field-sage p-5">
        <ActivityIndicator color="#193D32" />
        <Text className="mt-3 text-center text-sm text-field-pine">Comprobando permiso de cámara…</Text>
      </View>
    );
  }

  if (temporaryUri) {
    return (
      <View className="mt-3 rounded-3xl bg-field-sage p-4">
        <Image
          accessibilityLabel="Fotografía capturada del avistamiento"
          className="h-64 w-full rounded-2xl bg-field-pine"
          resizeMode="contain"
          source={{ uri: temporaryUri }}
        />
        <Text className="mt-3 text-sm font-bold text-field-pine">Vista previa lista</Text>
        {error ? (
          <Text accessibilityRole="alert" className="mt-2 text-sm leading-5 text-red-800">
            {error}
          </Text>
        ) : null}
        <View className="mt-3 gap-3">
          <PrimaryButton disabled={accepting} label={accepting ? 'Guardando foto…' : 'Usar esta foto'} onPress={handleAccept} />
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: accepting }}
            className="min-h-12 items-center justify-center rounded-2xl border border-field-pine px-4 py-3"
            disabled={accepting}
            onPress={() => {
              setTemporaryUri(null);
              setError(null);
            }}
          >
            <Text className="font-bold text-field-pine">Repetir foto</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (cameraStatus === 'requesting') {
    return (
      <View className="mt-3 items-center rounded-3xl bg-field-sage p-5">
        <ActivityIndicator color="#193D32" />
        <Text className="mt-3 text-center text-sm text-field-pine">Solicitando acceso a la cámara…</Text>
      </View>
    );
  }

  if (cameraStatus !== 'granted') {
    const permanentlyDenied = permissionRecoveryState(permission) === 'blocked';

    return (
      <View className="mt-3 rounded-3xl bg-field-sage p-5">
        <Text className="text-base font-bold text-field-pine">Se necesita acceso a la cámara</Text>
        <Text className="mt-2 text-sm leading-5 text-field-pine">
          AvistAves necesita la cámara para tomar la fotografía obligatoria del avistamiento. No se usa una galería.
        </Text>
        {error ? (
          <Text accessibilityRole="alert" className="mt-2 text-sm leading-5 text-red-800">
            {error}
          </Text>
        ) : null}
        <View className="mt-4 gap-3">
          {permanentlyDenied ? (
            <PrimaryButton label="Abrir ajustes" onPress={() => Linking.openSettings().catch(() => setError('No se pudieron abrir los ajustes del dispositivo.'))} />
          ) : (
            <PrimaryButton label="Permitir cámara" onPress={handleRequestPermission} />
          )}
          <Pressable accessibilityRole="button" className="items-center py-2" onPress={onCancel}>
            <Text className="font-bold text-field-pine">Cancelar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-3 overflow-hidden rounded-3xl bg-field-pine p-3">
      <CameraView
        ref={cameraRef}
        facing="back"
        onCameraReady={() => {
          setCameraReady(true);
          setError(null);
        }}
        onMountError={() => {
          setStatus('error');
          setError('No se pudo iniciar la cámara. Revisa el permiso e inténtalo nuevamente.');
        }}
        style={{ height: 320, width: '100%' }}
      />
      <Text className="px-2 pt-3 text-center text-sm text-field-sage">Encuadra el ave y toma una foto clara.</Text>
      {error ? (
        <Text accessibilityRole="alert" className="px-2 pt-2 text-center text-sm leading-5 text-red-200">
          {error}
        </Text>
      ) : null}
      <View className="mt-3 gap-3">
        <PrimaryButton disabled={!cameraReady || capturing} label={capturing ? 'Capturando…' : 'Capturar foto'} onPress={handleCapture} />
        <Pressable accessibilityRole="button" className="items-center py-2" onPress={onCancel}>
          <Text className="font-bold text-field-sage">Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}
