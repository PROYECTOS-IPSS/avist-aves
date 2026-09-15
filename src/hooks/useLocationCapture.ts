import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import {
  getCurrentLocation,
  getForegroundLocationPermission,
  requestForegroundLocationPermission,
  reverseGeocodeLocation,
} from '../services/locationService';
import type { LocationCoordinates } from '../utils/locationHelpers';

const LOCATION_TIMEOUT_MS = 15_000;
export type LocationCaptureResult = {
  coordinates: LocationCoordinates;
  locationLabel: string;
};

export type LocationCaptureStatus = 'idle' | 'requestingPermission' | 'acquiring' | 'success' | 'denied' | 'error';

function withTimeout<T>(promise: Promise<T>, milliseconds: number): Promise<T> {
  const { promise: boundedPromise, resolve, reject } = Promise.withResolvers<T>();
  const timeout = setTimeout(() => reject(new Error('LOCATION_TIMEOUT')), milliseconds);

  promise.then(
    (value) => {
      clearTimeout(timeout);
      resolve(value);
    },
    (error: unknown) => {
      clearTimeout(timeout);
      reject(error);
    },
  );

  return boundedPromise;
}

export function useLocationCapture(onLocated: (result: LocationCaptureResult) => void) {
  const [status, setStatus] = useState<LocationCaptureStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [permissionBlocked, setPermissionBlocked] = useState(false);
  const operationRef = useRef<Promise<void> | null>(null);
  const nativeRequestRef = useRef<Promise<LocationCoordinates> | null>(null);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') return;
      void getForegroundLocationPermission()
        .then((permission) => {
          setPermissionBlocked(!permission.granted && permission.canAskAgain === false);
          if (permission.granted) setError(null);
        })
        .catch(() => undefined);
    });
    return () => subscription.remove();
  }, []);

  const acquireLocation = useCallback(() => {
    if (operationRef.current || nativeRequestRef.current) {
      setError('La solicitud de ubicación anterior aún está finalizando.');
      setStatus('error');
      return;
    }

    const operation = (async () => {
      setError(null);
      setPermissionBlocked(false);
      setStatus('requestingPermission');

      let permission = await getForegroundLocationPermission();
      if (!permission.granted) {
        if (permission.canAskAgain === false) {
          setPermissionBlocked(true);
          setStatus('denied');
          setError('El permiso de ubicación está bloqueado. Actívalo desde los ajustes del dispositivo.');
          return;
        }

        permission = await requestForegroundLocationPermission();
      }

      if (!permission.granted) {
        setPermissionBlocked(permission.canAskAgain === false);
        setStatus('denied');
        setError('Sin permiso de ubicación no se puede registrar el lugar del avistamiento.');
        return;
      }

      setStatus('acquiring');
      const nativeRequest = getCurrentLocation();
      nativeRequestRef.current = nativeRequest;
      nativeRequest.then(
        () => {
          if (nativeRequestRef.current === nativeRequest) nativeRequestRef.current = null;
        },
        () => {
          if (nativeRequestRef.current === nativeRequest) nativeRequestRef.current = null;
        },
      );

      const coordinates = await withTimeout(nativeRequest, LOCATION_TIMEOUT_MS);
      let locationLabel = 'Ubicación obtenida';
      try {
        locationLabel = await reverseGeocodeLocation(coordinates);
      } catch {
        // Valid coordinates remain useful when the geocoder is unavailable.
      }

      onLocated({ coordinates, locationLabel });
      setStatus('success');
    })();

    operationRef.current = operation;
    operation.then(
      () => {
        if (operationRef.current === operation) operationRef.current = null;
      },
      () => {
        if (operationRef.current === operation) operationRef.current = null;
      },
    );

    operation.catch((captureError: unknown) => {
      if (captureError instanceof Error && captureError.message === 'LOCATION_TIMEOUT') {
        setError('La ubicación está tardando demasiado. Revisa el GPS e inténtalo nuevamente.');
      } else {
        setError('No se pudo obtener la ubicación. Revisa el GPS e inténtalo nuevamente.');
      }
      setStatus('error');
    });
  }, [onLocated]);

  return { acquireLocation, error, permissionBlocked, status };
}
