# P2 Implementation

## Dependency

Installed `expo-sqlite` with:

```bash
npx expo install expo-sqlite
```

The SDK-compatible package is `~57.0.3`. Expo SQLite's exported hooks require `expo-asset`, so Expo asset `~57.0.17` was installed as the supporting Expo module. Existing NativeWind runtime dependency `react-native-reanimated@4.5.1` was restored after npm peer resolution removed it; it remains required for the P1 styling pipeline.

Expo added `expo-sqlite` and `expo-asset` config plugins to `app.json`. No ORM, query builder, or persistence dependency was added.
## Domain model

`src/domain/sightings.ts` defines `Sighting`, `CreateSightingInput`, and the closed `SightingsOrder` union. Creation input reuses the entity shape with generated `id`, `createdAt`, and `updatedAt` omitted.

## Database layer

`src/db/database.ts` exposes `getDatabase()`:

1. Opens `avistaves.db` with `openDatabaseAsync` on first request.
2. Calls `migrateDatabase` before resolving.
3. Caches the pending/resolved promise to avoid duplicate initialization.
4. Clears the cached promise when initialization fails so a later caller can retry.

No provider or root-layout wiring was added; no P2 screen consumes the repository yet. This keeps P3 UI work separate while exposing a ready application boundary.

`src/db/migrations.ts` reads `PRAGMA user_version`, applies ordered migrations inside `withTransactionAsync`, and writes the version after each successful migration. Unsupported newer versions and missing migration steps throw visibly; no drop/recreate fallback exists.

## Schema and constraints

Version 1 creates only `sightings`, with the P0 columns, required fields, coordinate/quantity checks, and indexes for observed date and case-insensitive bird name. See `sqlite-schema.md` for the exact SQL mirrored from `migrations.ts`.

## Repository

`src/repositories/SightingsRepository.ts` encapsulates all sightings SQL:

- `create(input)`: validates required values, generates local ID and UTC timestamps, inserts using bound parameters, then reads the inserted row through a bound ID.
- `findAll(order)`: selects rows and appends only one internal order fragment from the fixed whitelist.
- `findById(id)`: selects by bound ID and returns `null` for unknown IDs.

There is no update, delete, pagination, search, soft delete, or sync API.

## Mapping and validation

`src/repositories/sightingMapper.ts` accepts an unknown SQLite row, validates expected strings/numbers, preserves nullable values, and returns camelCase `Sighting`. Raw snake_case rows never leave the repository boundary.

Repository validation rejects empty bird/photo values, invalid coordinates, non-integer or sub-one quantities, and missing observation timestamps before SQL execution. SQLite constraints remain the final integrity boundary.

## IDs and timestamps

IDs use `globalThis.crypto.randomUUID()` where available. The fallback is a local timestamp/random identifier suitable for offline route keys without adding a package. `createdAt` and `updatedAt` are generated once per insert as ISO-8601 UTC. `observedAt` is supplied by the caller and stored unchanged as an ISO-oriented domain string.

## Testing

Jest covers complete and nullable row mapping, fixed ordering fragments, default newest-first ordering, and rejection of an order value outside the whitelist. An Android Expo Go smoke route (temporary and removed after validation) exercised real `expo-sqlite` initialization, schema version 1, singleton reuse, `create`, `findById`, and `findAll` against the device database. No fake SQL adapter was added.
