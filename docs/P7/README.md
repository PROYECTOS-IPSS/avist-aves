# P7 — Open-Meteo + Final Registration Save

- **Previous:** P6 — GPS + Reverse Geocoding
- **Current:** P7 — Open-Meteo + Final Registration Save
- **Next:** P8 — Listing + Sorting + Empty State

## Implemented scope

- Open-Meteo current-weather request from real P6 coordinates.
- Narrow request for temperature, relative humidity, weather code, and wind speed.
- Typed external-response validation and Spanish WMO weather-code mapping.
- Five-second request timeout and one retry for network, timeout, HTTP 5xx, and HTTP 429 failures.
- Ten-minute in-memory cache using three-decimal coordinate buckets.
- Non-blocking weather state and `Clima no disponible` fallback.
- Weather snapshot mapping into the existing SQLite weather columns.
- Final whole-draft validation before persistence.
- Real `SightingsRepository.create(...)` call.
- Duplicate-submit guard, save progress, repository-error state, success feedback, and post-insert navigation to `/`.
- Persistent photo URI retained after repository failure for retry.

## Explicit exclusions

P8 list rendering/loading/sorting/empty-state integration, detail data loading, weather history refetching, background location, continuous tracking, backend, authentication, synchronization, and global orphan cleanup remain excluded.

## Schema decision

No SQLite migration was added. Existing schema already persists temperature, humidity, weather code, and readable weather description required by RF-02. Wind speed is requested and displayed when available but remains request/UI-only because authoritative project requirements do not require a persisted wind column.

## Quality gates

- `yarn typecheck`: **PASS**
- `yarn lint`: **PASS**
- `yarn test`: **PASS** — 9 suites, 78 tests
- `npx expo-doctor`: **PASS** — 21/21 checks
- Real Open-Meteo network test: **NOT EXECUTED**
- SQLite runtime save test: **NOT EXECUTED**
- Web validation: **NOT EXECUTED**
- P5 camera physical validation: **PENDING USER CHECK**
- P6 GPS physical validation: **PENDING USER CHECK**

## Runtime/build status

P7 adds no native dependency. Existing development client still needs the P5/P6 native rebuild before camera/GPS runtime validation:

```bash
yarn build:dev
yarn start
```

OMP did not run Android build, EAS build, `expo prebuild`, or web validation. After the correct development APK is installed, P7 JavaScript/TypeScript changes use `yarn start`.

READY FOR P8: YES