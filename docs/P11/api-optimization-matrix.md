# P11 API Optimization Matrix

Evidence reflects repository implementation inspected during P11. No network inspector or physical runtime measurement was performed by OMP.

| Measure | Code evidence | Network benefit | Reliability benefit | Test evidence |
|---|---|---|---|---|
| Narrow current-weather request | `src/services/weatherService.ts:buildWeatherUrl` requests only `temperature_2m`, `relative_humidity_2m`, `weather_code`, `wind_speed_10m`, `timezone=auto` | Avoids forecast/hourly/daily payload and processing not used by app | Smaller untrusted response surface | URL assertion confirms required current fields and absence of `hourly`/`daily` |
| Bounded timeout | `src/services/weatherService.ts:requestOnce` uses `AbortController` and 5,000 ms timer; `finally` clears timer | Prevents indefinite network wait | Timeout becomes controlled retryable failure, then nullable weather | Hanging fetcher with 1 ms timeout resolves unavailable; retry remains capped |
| Bounded retry | `requestOnce` classifies network/timeout, 429, and 5xx; `fetchCurrentWeather` loops at most twice | Limits transient request amplification to two attempts | Recovers transient outage without infinite retry; ordinary 4xx/malformed payloads stop | Transient failure → success calls fetch twice; repeated failure calls twice; 400 calls once |
| Coordinate-bucket TTL cache | `weatherCacheKey` rounds lat/lon to three decimals; `weatherCache` TTL is 10 minutes; successful responses only | Same/nearby registration location avoids duplicate Open-Meteo calls within TTL | Expired data refetches; failures do not poison cache | Same bucket calls once; expiry calls twice; failed response is not cached |
| Same-key in-flight reuse | `useWeatherForLocation` returns `requestRef.current.promise` for active same-key request | Concurrent callers share one active request | Avoids duplicate work while preserving current weather state | Code-level ownership guard; direct React hook runtime measurement not executed by OMP |
| Stale-location rejection | `requestVersionRef` plus `isCurrentWeatherRequest` ignores older result/failure after new key starts | Prevents obsolete result from triggering current downstream state | Old location cannot replace newer location weather snapshot | Deterministic request-version test; physical race not executed |
| Request-after-GPS timing | Registration calls `loadWeather(coordinates)` only from successful P6 `handleLocated`; save uses current valid coordinates | No startup/Home/Detail weather calls | Weather remains optional and location-bound | Registration source flow inspected; no list/detail WeatherService imports |
| Historical snapshot reuse | Registration maps weather to `CreateSightingInput`; repository persists nullable weather; P8/P9 read Sighting fields | Home/detail navigation makes no new Open-Meteo request | Preserves observation-time weather semantics | Repository/schema mapping inspected; no runtime network inspector used |

## Manual evidence status

No network inspector, Android runtime, or request counter outside deterministic Jest mocks was used. Manual confirmation remains in `docs/P11/validation.md`.
