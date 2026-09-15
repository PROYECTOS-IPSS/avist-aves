import { weatherDescriptionForCode } from '../utils/weatherCode';
import type { LocationCoordinates } from '../utils/locationHelpers';

export type CurrentWeather = {
  temperature: number;
  humidity: number;
  weatherCode: number;
  weatherDescription: string;
  windSpeed: number | null;
};

export type WeatherResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

export type WeatherFetcher = (input: string, init?: { signal?: AbortSignal }) => Promise<WeatherResponse>;

type WeatherServiceOptions = {
  fetcher?: WeatherFetcher;
  now?: () => number;
  timeoutMs?: number;
};

type CacheEntry = {
  expiresAt: number;
  weather: CurrentWeather;
};

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const CACHE_TTL_MS = 10 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 5_000;
const weatherCache = new Map<string, CacheEntry>();


function finiteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function weatherCacheKey(coordinates: LocationCoordinates): string {
  return `${coordinates.latitude.toFixed(3)}:${coordinates.longitude.toFixed(3)}`;
}

export function buildWeatherUrl(coordinates: LocationCoordinates): string {
  return `${OPEN_METEO_URL}?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
}

export function parseCurrentWeather(payload: unknown): CurrentWeather | null {
  if (typeof payload !== 'object' || payload === null || !('current' in payload)) return null;
  const currentValue = payload.current;
  if (typeof currentValue !== 'object' || currentValue === null) return null;
  const current = currentValue as Record<string, unknown>;
  const temperature = current.temperature_2m;
  const humidity = current.relative_humidity_2m;
  const weatherCode = current.weather_code;

  if (!finiteNumber(temperature) || !finiteNumber(humidity) || !finiteNumber(weatherCode) || !Number.isInteger(weatherCode)) {
    return null;
  }

  return {
    temperature,
    humidity,
    weatherCode,
    weatherDescription: weatherDescriptionForCode(weatherCode),
    windSpeed: finiteNumber(current.wind_speed_10m) ? current.wind_speed_10m : null,
  };
}

function isRecoverableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

async function requestOnce(
  coordinates: LocationCoordinates,
  fetcher: (input: string, init?: { signal?: AbortSignal }) => Promise<WeatherResponse>,
  timeoutMs: number,
): Promise<{ weather: CurrentWeather | null; retryable: boolean }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetcher(buildWeatherUrl(coordinates), { signal: controller.signal });
    if (!response.ok) return { weather: null, retryable: isRecoverableStatus(response.status) };

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      return { weather: null, retryable: false };
    }

    return { weather: parseCurrentWeather(payload), retryable: false };
  } catch {
    return { weather: null, retryable: true };
  } finally {
    clearTimeout(timeout);
  }
}

export function clearWeatherCache(): void {
  weatherCache.clear();
}

export async function fetchCurrentWeather(
  coordinates: LocationCoordinates,
  options: WeatherServiceOptions = {},
): Promise<CurrentWeather | null> {
  const now = options.now ?? Date.now;
  const key = weatherCacheKey(coordinates);
  const cached = weatherCache.get(key);
  if (cached && cached.expiresAt > now()) return cached.weather;
  if (cached) weatherCache.delete(key);

  const fetcher = options.fetcher ?? ((input, init) => fetch(input, init));
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const result = await requestOnce(coordinates, fetcher, timeoutMs);
    if (result.weather) {
      weatherCache.set(key, { expiresAt: now() + CACHE_TTL_MS, weather: result.weather });
      return result.weather;
    }
    if (!result.retryable || attempt === 1) return null;
  }

  return null;
}
