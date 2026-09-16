import { ActivityIndicator, Text, View } from 'react-native';

import type { CurrentWeather } from '../services/weatherService';
import type { WeatherStatus as WeatherLoadStatus } from '../hooks/useWeatherForLocation';
import { FormField } from './FormField';

type WeatherStatusProps = {
  status: WeatherLoadStatus;
  weather: CurrentWeather | null;
};

export function WeatherStatus({ status, weather }: WeatherStatusProps) {
  const backgroundClass = status === 'unavailable' ? 'bg-field-amber' : status === 'idle' ? 'bg-field-sky' : 'bg-field-sage';

  return (
    <FormField label="Clima actual" labelId="weather-label" helper="Se consulta con las coordenadas del avistamiento y no bloquea el guardado.">
      <View className={`rounded-3xl p-4 ${backgroundClass}`}>
        {status === 'loading' ? (
          <View className="flex-row items-center gap-3">
            <ActivityIndicator color="#193D32" />
            <Text accessibilityLiveRegion="polite" className="text-sm font-semibold text-field-pine">Consultando clima…</Text>
          </View>
        ) : null}
        {status === 'idle' ? <Text accessibilityLiveRegion="polite" className="text-sm text-field-pine">Obtén una ubicación para consultar el clima.</Text> : null}
        {status === 'unavailable' ? (
          <View accessibilityLiveRegion="polite">
            <Text className="text-base font-bold text-field-pine">Clima no disponible</Text>
            <Text className="mt-2 text-sm leading-5 text-field-pine">Puedes guardar el avistamiento de todas formas.</Text>
          </View>
        ) : null}
        {status === 'success' && weather ? (
          <View accessibilityLiveRegion="polite">
            <Text className="text-base font-bold text-field-pine">{weather.weatherDescription}</Text>
            <Text className="mt-2 text-sm text-field-pine">
              {weather.temperature.toFixed(1)} °C · Humedad {weather.humidity.toFixed(0)} %
            </Text>
            {weather.windSpeed !== null ? (
              <Text className="mt-1 text-sm text-field-pine">Viento {weather.windSpeed.toFixed(1)} km/h</Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </FormField>
  );
}
