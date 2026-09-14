# P6 — GPS + Reverse Geocoding

- **Previous:** P5 — Camera + Persistent Image
- **Current:** P6 — GPS + Reverse Geocoding
- **Next:** P7 — Open-Meteo

## Implemented scope

- Point-of-use foreground location permission request.
- Spanish permission rationale and non-fatal denial handling.
- One-shot current-position acquisition with balanced accuracy.
- Duplicate acquisition guard and bounded 15-second UI wait.
- Coordinate range validation.
- Reverse geocoding with human-readable location label.
- Safe `Ubicación obtenida` fallback when geocoding has no result or fails.
- Latitude, longitude, and location label stored in the existing `SightingDraft`.
- Functional location section with obtain, retry, refresh, loading, error, and settings states.
- Previous valid location preserved when refresh fails.
- Deterministic coordinate and label helper tests.

## Explicit exclusions

Background location, continuous tracking, geofencing, weather, Open-Meteo, repository insertion, final save, list/detail integration, backend, authentication, synchronization, and manual coordinate inputs remain excluded.

## Quality gates

- `yarn typecheck`: **PASS**
- `yarn lint`: **PASS**
- `yarn test`: **PASS** — 6 suites, 53 tests
- `npx expo-doctor`: **PASS** — 21/21 checks
- Web validation: **NOT EXECUTED**
- Physical camera validation from P5: **PENDING USER CHECK**
- Physical GPS/reverse-geocoding validation: **PENDING USER CHECK**

## Native and development-client status

Added SDK 57-compatible `expo-location@~57.0.17` and the `expo-location` config plugin with a foreground-only Spanish rationale. A development-client rebuild is required before physical GPS validation because location is native functionality.

OMP did not run an Android build, web validation, `expo prebuild`, or an EAS build. Manual flow:

```bash
yarn build:dev
yarn start
```

Install/update generated development APK, then follow `docs/P6/validation.md`.

P5 camera acceptance remains truthfully pending as documented in `docs/P5/README.md` and `docs/P5/validation.md`.

READY FOR P7: YES