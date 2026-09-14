# SQLite Data Model

## Sightings entity

One row represents one completed or partially weather-enriched bird sighting. No sync tables.

```sql
CREATE TABLE IF NOT EXISTS sightings (
  id TEXT PRIMARY KEY NOT NULL,
  bird_name TEXT NOT NULL CHECK (length(trim(bird_name)) > 0),
  photo_uri TEXT NOT NULL,
  latitude REAL NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude REAL NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  location_label TEXT,
  observed_at TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  notes TEXT,
  temperature REAL,
  humidity REAL,
  weather_code INTEGER,
  weather_description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sightings_observed_at ON sightings(observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_sightings_bird_name ON sightings(bird_name COLLATE NOCASE);
```

## Types and nullability

- `id`: TEXT UUID generated on device; stable route key, not user input.
- Names/URIs/timestamps: TEXT; timestamps ISO-8601 UTC. `bird_name`, `photo_uri`, `observed_at`, `created_at`, `updated_at` required.
- Coordinates: REAL required, original GPS values.
- `location_label`, `notes`, `temperature`, `humidity`, `weather_code`, `weather_description`: nullable because reverse geocoding/weather can fail.
- Quantity: INTEGER required, database and form enforce >= 1.

`updated_at` exists for data integrity and future local maintenance, not remote synchronization. No foreign keys because no related entities exist.

## Persistence strategy

`Camera → temporary URI → persistent app-files URI → SQLite photo_uri`. Copy succeeds before insert. Insert failure triggers best-effort deletion of copied file; missing file on read displays recoverable unavailable-photo state. Database stores URI, never image blob, keeping rows small and image lifecycle explicit.

## Access contract

`SightingsRepository.create(input)`, `findAll(order)`, `findById(id)`. `findAll` defaults `observed_at DESC`; allowed order values are a fixed whitelist (date/name/quantity), not interpolated raw SQL. Row mapper converts SQLite nullable columns to domain types. No update/delete until requirement appears.

## Migration strategy

First release creates schema through `expo-sqlite` initialization. Store schema version using SQLite migration mechanism; future migrations are ordered, idempotent steps and preserve user rows. Backup/export is out of MVP scope. Initialization failure enters visible app error state rather than silently dropping data.
