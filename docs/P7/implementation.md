# P7 Implementation

## Open-Meteo request

`src/services/weatherService.ts` uses plain `fetch` against:

`https://api.open-meteo.com/v1/forecast`

Current query fields:

- `temperature_2m`
- `relative_humidity_2m`
- `weather_code`
- `wind_speed_10m`
- `timezone=auto`

The request uses the real latitude/longitude from P6. No SDK or API key was added.

## Weather domain and validation

External JSON is parsed at the service boundary into:

```ts
type CurrentWeather = {
  temperature: number;
  humidity: number;
  weatherCode: number;
  weatherDescription: string;
  windSpeed: number | null;
};
```

The parser rejects missing `current`, non-object `current`, non-finite temperature/humidity, and non-integer weather code. Missing or invalid wind becomes `null` because wind is optional. Raw Open-Meteo response objects do not enter the screen or repository.

## Weather-code mapping

`src/utils/weatherCode.ts` maps WMO families to Spanish descriptions:

- `0`: Despejado
- `1–3`: Principalmente despejado / Parcialmente nublado / Nublado
- `45, 48`: Niebla
- `51–57`: Llovizna
- `61–67`: Lluvia
- `71–77`: Nieve
- `80–82`: Chubascos
- `85–86`: Chubascos de nieve
- `95`: Tormenta
- `96–99`: Tormenta con granizo
- unknown/non-finite: Condición desconocida

## Timeout, retry, and cache

Each request uses `AbortController` with a five-second timeout. One additional attempt is allowed for network/timeout failures, HTTP 5xx, and HTTP 429. Ordinary 4xx responses and malformed successful payloads become unavailable without another retry.

Successful weather is cached in process memory for ten minutes. The key rounds latitude and longitude to three decimals: `lat.toFixed(3):lon.toFixed(3)`. Cache is cleared on process restart and never written to SQLite or AsyncStorage. Unavailable results are not cached.

## Weather timing and UI

`useWeatherForLocation` starts one weather load after successful GPS acquisition. The final save reuses the same in-flight request or cached result, avoiding duplicate calls. A weather failure renders `Clima no disponible` and does not block save. The success UI displays temperature, readable condition, humidity, and wind when supplied.

Saved weather is a registration-time snapshot. P8 list/detail work must read nullable persisted values and must not refetch weather to replace history.

## Final validation and mapping

`createSightingInput()` validates the whole `SightingDraft`, normalizes editable fields, requires persistent photo URI and valid coordinates, and maps optional weather to nullable repository fields. It stores the existing `locationLabel` fallback/label. Missing weather maps to null values; no invalid required field is coerced.

## Save orchestration

`app/sightings/new.tsx` follows:

1. Validate whole draft.
2. Get current weather best effort from current coordinates.
3. Build `CreateSightingInput`.
4. Call `new SightingsRepository().create(input)`.
5. Show success state and alert only after insert resolves.
6. Return to `/` only from the success action.

A synchronous ref plus save state prevents duplicate submissions. Save button is disabled while saving and after success. Repository failure keeps the screen, draft, and persistent photo intact and exposes retry.

P7 does not fake a list card, insert SQL from the screen, or implement P8 list/detail loading.

## Schema and native status

No migration was necessary. Existing version 1 schema already has nullable `temperature`, `humidity`, `weather_code`, and `weather_description` columns. Wind is requested/displayed but not persisted because current requirements do not require it.

P7 adds no native module or config plugin. Camera/location physical validation still requires the existing rebuilt development client from P5/P6.
