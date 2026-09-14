# P2 SQLite Schema

Source of truth: `src/db/migrations.ts`. SQL below mirrors implementation.

## Schema version

- Database: `avistaves.db`
- Version mechanism: SQLite `PRAGMA user_version`
- Initial version: `1`
- Migration application: ordered, transactional, no destructive reset

## SQL

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

CREATE INDEX IF NOT EXISTS idx_sightings_observed_at
  ON sightings(observed_at DESC);

CREATE INDEX IF NOT EXISTS idx_sightings_bird_name
  ON sightings(bird_name COLLATE NOCASE);
```

After each migration, implementation executes an internal constant statement equivalent to `PRAGMA user_version = 1`.

## Column mapping

| SQLite column | SQLite type | Nullable | Domain field | Constraint / meaning |
|---|---|---:|---|---|
| `id` | TEXT | No | `id` | Local stable ID, primary key |
| `bird_name` | TEXT | No | `birdName` | Trimmed non-empty |
| `photo_uri` | TEXT | No | `photoUri` | Persistent URI later; synthetic URI valid in P2 tests |
| `latitude` | REAL | No | `latitude` | -90..90 |
| `longitude` | REAL | No | `longitude` | -180..180 |
| `location_label` | TEXT | Yes | `locationLabel` | Reverse geocoding is best effort |
| `observed_at` | TEXT | No | `observedAt` | Caller-provided ISO-oriented timestamp |
| `quantity` | INTEGER | No | `quantity` | Integer >= 1 |
| `notes` | TEXT | Yes | `notes` | Optional user text |
| `temperature` | REAL | Yes | `temperature` | Weather may be unavailable |
| `humidity` | REAL | Yes | `humidity` | Weather may be unavailable |
| `weather_code` | INTEGER | Yes | `weatherCode` | Weather may be unavailable |
| `weather_description` | TEXT | Yes | `weatherDescription` | Weather may be unavailable |
| `created_at` | TEXT | No | `createdAt` | ISO-8601 UTC |
| `updated_at` | TEXT | No | `updatedAt` | ISO-8601 UTC |

No sync, remote ID, deletion, auth, or server-version columns exist.

## Example row and mapping

SQLite row:

```text
{
  id: "local-id",
  bird_name: "Chucao",
  photo_uri: "file:///test/bird.jpg",
  latitude: -38.7,
  longitude: -72.6,
  location_label: null,
  observed_at: "2026-09-14T10:00:00.000Z",
  quantity: 1,
  notes: null,
  temperature: null,
  humidity: null,
  weather_code: null,
  weather_description: null,
  created_at: "2026-09-14T10:01:00.000Z",
  updated_at: "2026-09-14T10:01:00.000Z"
}
```

`mapSightingRow()` returns `locationLabel`, `notes`, `temperature`, `humidity`, `weatherCode`, and `weatherDescription` as `null`, with all other fields mapped to camelCase. Invalid runtime types throw instead of being silently cast.

## Query safety

All values use SQLite bound parameters (`?`). Only the `ORDER BY` fragment is selected from this internal map:

- `date` → `observed_at DESC`
- `name` → `bird_name COLLATE NOCASE ASC`
- `quantity` → `quantity DESC`

Arbitrary order strings never reach SQL.
