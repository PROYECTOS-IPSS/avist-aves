import { useCallback, useRef, useState } from 'react';

import {
  fetchCurrentWeather,
  weatherCacheKey,
  type CurrentWeather,
} from '../services/weatherService';
import type { LocationCoordinates } from '../utils/locationHelpers';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'unavailable';

type WeatherRequest = {
  key: string;
  promise: Promise<CurrentWeather | null>;
};

export function useWeatherForLocation() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const weatherRef = useRef<CurrentWeather | null>(null);
  const statusRef = useRef<WeatherStatus>('idle');
  const weatherKeyRef = useRef<string | null>(null);
  const requestRef = useRef<WeatherRequest | null>(null);

  const loadWeather = useCallback(async (coordinates: LocationCoordinates, force = false) => {
    const key = weatherCacheKey(coordinates);
    if (!force && weatherKeyRef.current === key && statusRef.current !== 'loading') {
      return weatherRef.current;
    }
    if (requestRef.current) return requestRef.current.promise;

    weatherKeyRef.current = key;
    weatherRef.current = null;
    statusRef.current = 'loading';
    setWeather(null);
    setStatus('loading');

    const promise = fetchCurrentWeather(coordinates);
    requestRef.current = { key, promise };

    try {
      const result = await promise;
      weatherRef.current = result;
      statusRef.current = result ? 'success' : 'unavailable';
      setWeather(result);
      setStatus(result ? 'success' : 'unavailable');
      return result;
    } catch {
      weatherRef.current = null;
      statusRef.current = 'unavailable';
      setWeather(null);
      setStatus('unavailable');
      return null;
    } finally {
      if (requestRef.current?.promise === promise) requestRef.current = null;
    }
  }, []);

  const getWeatherForSave = useCallback(
    (coordinates: LocationCoordinates) => loadWeather(coordinates),
    [loadWeather],
  );

  return { getWeatherForSave, loadWeather, status, weather };
}
