# P2 — SQLite + Repository

- **Previous phase:** P1
- **Current phase:** P2
- **Next phase:** P3

## Objective

Implement local SQLite persistence, schema version 1, explicit row mapping, and the minimum `SightingsRepository` contract required by later phases.

## Scope

Implemented:

- `expo-sqlite` SDK-compatible dependency.
- Lazy singleton database opening and migration.
- `sightings` table, constraints, and indexes.
- Domain types and creation input.
- Local ID and UTC timestamp generation.
- Parameterized `create`, `findAll`, and `findById` operations.
- Closed whitelist for date/name/quantity ordering.
- Explicit snake_case SQLite row to camelCase domain mapping.
- Nullable weather and location fields.
- Mapper, ordering, and repository boundary tests.
- Android runtime SQLite smoke validation.

Not implemented: UI integration, camera, GPS, reverse geocoding, files, Open-Meteo, permissions, form logic, backend, update/delete, or synchronization.

## Main files

- `src/domain/sightings.ts`
- `src/db/database.ts`
- `src/db/migrations.ts`
- `src/repositories/SightingsRepository.ts`
- `src/repositories/sightingMapper.ts`
- `src/repositories/__tests__/sightingMapper.test.ts`
- `src/repositories/__tests__/SightingsRepository.test.ts`
- `docs/P2/implementation.md`
- `docs/P2/sqlite-schema.md`
- `docs/P2/validation.md`
- `docs/P2/decisions.md`

## Persistence baseline

- expo-sqlite: `~57.0.3`, installed with `npx expo install expo-sqlite`
- Supporting Expo asset module: `~57.0.17`, required by Expo SQLite's exported hooks
- Existing NativeWind runtime: `react-native-reanimated@4.5.1`
- Database name: `avistaves.db`
- Schema version: `1`
- ID strategy: runtime `crypto.randomUUID()` with small local fallback
- Timestamp strategy: ISO-8601 UTC via `toISOString()`
- Initialization: lazy singleton; first access opens database and applies pending migrations

## Gates

- TypeScript: PASS
- ESLint: PASS
- Jest: PASS — 3 suites, 9 tests
- Expo Doctor: PASS — 21/21 checks
- Android Expo Go runtime smoke: PASS — `schema=1`, repeated provider access reused one connection, repository create/findById/findAll returned rows.

## Risks

- SQLite native behavior still requires confirmation in P14 Preview APK; Expo Go smoke is evidence of current API compatibility, not final release proof.
- Web SQLite is not used for this phase's runtime evidence because Expo SQLite's WASM asset needs separate Metro web configuration; mobile target is Android.

## Conclusion

P2 delivers a small, local-only, parameterized repository without adding an ORM or future-phase device/API functionality.

**READY FOR P3: YES**
