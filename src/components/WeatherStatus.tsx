import { Text, View } from 'react-native';

import type { CurrentWeather } from '../services/weatherService';
import type { WeatherStatus as WeatherLoadStatus } from '../hooks/useWeatherForLocation';
import { FormField } from './FormField';

type WeatherStatusProps = {
  status: WeatherLoadStatus;
  weather: CurrentWeather | null;
};

export function WeatherStatus({ status, weather }: WeatherStatusProps) {
  return (
    <FormField label="Clima actual" labelId="weather-label" helper="Se consulta con las coordenadas del avistamiento y no bloquea el guardado.">
      <View className="rounded-3xl bg-field-sage p-4">
        {status === 'loading' ? <Text className="text-sm text-field-pine">Consultando clima…</Text> : null}
        {status === 'idle' ? <Text className="text-sm text-field-pine">Obtén una ubicación para consultar el clima.</Text> : null}
        {status === 'unavailable' ? (
          <>
            <Text className="text-base font-bold text-field-pine">Clima no disponible</Text>
            <Text className="mt-2 text-sm leading-5 text-field-pine">Puedes guardar el avistamiento de todas formas.</Text>
          </>
        ) : null}
        {status === 'success' && weather ? (
          <>
            <Text className="text-base font-bold text-field-pine">{weather.weatherDescription}</Text>
            <Text className="mt-2 text-sm text-field-pine">
              {weather.temperature.toFixed(1)} °C · Humedad {weather.humidity.toFixed(0)} %
            </Text>
            {weather.windSpeed !== null ? (
              <Text className="mt-1 text-sm text-field-pine">Viento {weather.windSpeed.toFixed(1)} km/h</Text>
            ) : null}
          </>
        ) : null}
      </View>
    </FormField>
  );
}
