# P11 Implementation

## API optimization evidence

### 1. Coordinate-bucket TTL cache

`src/services/weatherService.ts` rounds valid coordinates to three decimals for `weatherCacheKey`, then stores successful `CurrentWeather` results for ten minutes in process memory. This avoids duplicate Open-Meteo requests for the same/effectively same registration location. Expired entries are deleted before use. Null/failure results are never cached, so transient failures do not suppress future recovery.

### 2. Timeout and bounded retry

Each `requestOnce` creates an `AbortController`, schedules a five-second abort, and clears the timer in `finally`. `fetchCurrentWeather` allows at most two attempts total. Network/abort failures, HTTP 429, and HTTP 5xx are retryable; ordinary 4xx and malformed successful payloads are not. Weather exhaustion returns `null`, so registration can still persist nullable weather.

### 3. Historical SQLite snapshot

Registration obtains weather only after valid GPS coordinates, maps the typed result into `CreateSightingInput`, and persists temperature/humidity/code/description through `SightingsRepository`. P8 list and P9 detail read those stored fields. They do not import or invoke `WeatherService`; navigating Home/detail therefore avoids repeated weather API calls and preserves observation-time semantics.

### Additional confirmed measures

- `buildWeatherUrl` contains only current variables needed by the app; no hourly/daily forecast arrays.
- `useWeatherForLocation` returns the active same-key promise to concurrent callers.
- `requestVersionRef` and `isCurrentWeatherRequest` ignore late results from an older coordinate key.
- Weather starts from P6's successful `handleLocated` callback, not app startup, Home, Detail, render, or keystrokes.

## Failure semantics

Timeout, retry exhaustion, malformed response, offline network, and non-retryable HTTP failure all become unavailable weather. UI shows `Clima no disponible`; save continues with nullable weather fields. No optimization changes required weather availability or historical persistence.

## Test evidence

`weatherService.test.ts` measures fetcher invocation counts for retry cap, ordinary 4xx, bucket cache hit, cache expiry, timeout, and failed-response non-caching. It also asserts the narrow current-weather URL. `useWeatherForLocation.test.ts` covers stale request-version ownership. Tests use deterministic fetch mocks; no real network was called.
