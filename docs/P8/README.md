# P8 — Listing + Sorting + Empty State

- **Previous:** P7 — Open-Meteo + Final Registration Save
- **Current:** P8 — Listing + Sorting + Empty State
- **Next:** P9 — Detail

## Implemented scope

- Home loads real sightings through `SightingsRepository.findAll(order)`.
- Newest-first default ordering.
- Typed ordering controls for date, bird name, and quantity.
- Focus refresh through Expo Router when Home becomes active.
- Real persisted sighting cards with photo thumbnail, bird name, date, location, weather, and quantity.
- Human-readable Spanish-friendly date formatting.
- Historical SQLite weather snapshot display only; no Open-Meteo requests from the list.
- Designed loading, repository-error/retry, and empty states.
- Direct registration CTA in the header and empty state.
- FlatList composition without nested vertical ScrollView.
- Graceful broken-photo thumbnail fallback.

## Explicit exclusions

Full detail loading, detail data rendering, list/detail polish, Open-Meteo calls, weather refresh, background location, backend, authentication, synchronization, and fake production cards remain excluded.

Card-to-detail navigation is deferred to P9 so the existing detail shell is not presented as a completed feature.

## Quality gates

- `yarn typecheck`: **PASS**
- `yarn lint`: **PASS**
- `yarn test`: **PASS** — 11 suites, 87 tests
- `npx expo-doctor`: **PASS** — 21/21 checks
- Real SQLite list refresh validation: **PENDING USER CHECK**
- Web validation: **NOT EXECUTED**
- P5 camera/P6 GPS/P7 save physical validation: **PENDING USER CHECK**

## Native/build impact

P8 adds no native dependency and requires no development-client rebuild by itself. If the correct P5/P6 development APK is already installed:

```bash
yarn start
```

OMP did not run Android builds, EAS builds, `expo prebuild`, or web validation. Existing P5/P6 native validation still requires their documented rebuild workflow.

READY FOR P9: YES