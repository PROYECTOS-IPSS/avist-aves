import type { SQLiteDatabase } from 'expo-sqlite';

export const CURRENT_SCHEMA_VERSION = 1;

export const SIGHTINGS_TABLE_SQL = `
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
`;

export const SIGHTINGS_INDEXES_SQL = `
  CREATE INDEX IF NOT EXISTS idx_sightings_observed_at
    ON sightings(observed_at DESC);
  CREATE INDEX IF NOT EXISTS idx_sightings_bird_name
    ON sightings(bird_name COLLATE NOCASE);
`;

type SchemaVersionRow = { user_version: number };

type Migration = (database: SQLiteDatabase) => Promise<void>;

const migrations: Record<number, Migration> = {
  1: async (database) => {
    await database.execAsync(SIGHTINGS_TABLE_SQL);
    await database.execAsync(SIGHTINGS_INDEXES_SQL);
  },
};

export async function getSchemaVersion(database: SQLiteDatabase): Promise<number> {
  const row = await database.getFirstAsync<SchemaVersionRow>('PRAGMA user_version');
  return row?.user_version ?? 0;
}

export async function migrateDatabase(database: SQLiteDatabase): Promise<void> {
  const currentVersion = await getSchemaVersion(database);

  if (currentVersion > CURRENT_SCHEMA_VERSION) {
    throw new Error(
      `Database schema version ${currentVersion} is newer than supported version ${CURRENT_SCHEMA_VERSION}`,
    );
  }

  if (currentVersion === CURRENT_SCHEMA_VERSION) {
    return;
  }

  await database.withTransactionAsync(async () => {
    for (let version = currentVersion + 1; version <= CURRENT_SCHEMA_VERSION; version += 1) {
      const migration = migrations[version];
      if (!migration) {
        throw new Error(`Missing migration for schema version ${version}`);
      }
      await migration(database);
      await database.execAsync(`PRAGMA user_version = ${version}`);
    }
  });
}
