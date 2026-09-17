import type { SQLiteDatabase } from 'expo-sqlite';

import { getDatabase } from '../db/database';
import type { CreateSightingInput, Sighting, SightingsOrder } from '../domain/sightings';
import { getOrderByClause, mapSightingRow } from './sightingMapper';

const INSERT_SIGHTING_SQL = `
  INSERT INTO sightings (
    id,
    bird_name,
    photo_uri,
    latitude,
    longitude,
    location_label,
    observed_at,
    quantity,
    notes,
    temperature,
    humidity,
    weather_code,
    weather_description,
    created_at,
    updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const SELECT_COLUMNS = `
  id,
  bird_name,
  photo_uri,
  latitude,
  longitude,
  location_label,
  observed_at,
  quantity,
  notes,
  temperature,
  humidity,
  weather_code,
  weather_description,
  created_at,
  updated_at
`;

function createLocalId(): string {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) {
    return uuid;
  }

  return `sighting-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function assertCreateInput(input: CreateSightingInput): void {
  if (!input.birdName.trim()) {
    throw new Error('birdName is required');
  }
  if (!input.photoUri.trim()) {
    throw new Error('photoUri is required');
  }
  if (!Number.isFinite(input.latitude) || input.latitude < -90 || input.latitude > 90) {
    throw new Error('latitude must be between -90 and 90');
  }
  if (!Number.isFinite(input.longitude) || input.longitude < -180 || input.longitude > 180) {
    throw new Error('longitude must be between -180 and 180');
  }
  if (!Number.isInteger(input.quantity) || input.quantity < 1) {
    throw new Error('quantity must be an integer greater than or equal to 1');
  }
  if (!input.observedAt.trim()) {
    throw new Error('observedAt is required');
  }
}

export class SightingsRepository {
  constructor(private readonly databaseProvider: () => Promise<SQLiteDatabase> = getDatabase) {}

  async create(input: CreateSightingInput): Promise<Sighting> {
    assertCreateInput(input);

    const database = await this.databaseProvider();
    const id = createLocalId();
    const timestamp = new Date().toISOString();

    await database.runAsync(INSERT_SIGHTING_SQL, [
      id,
      input.birdName.trim(),
      input.photoUri.trim(),
      input.latitude,
      input.longitude,
      input.locationLabel,
      input.observedAt,
      input.quantity,
      input.notes,
      input.temperature,
      input.humidity,
      input.weatherCode,
      input.weatherDescription,
      timestamp,
      timestamp,
    ]);

    const row = await database.getFirstAsync<unknown>(
      `SELECT ${SELECT_COLUMNS} FROM sightings WHERE id = ?`,
      id,
    );
    if (row === null) {
      throw new Error(`Created sighting ${id} could not be read`);
    }

    return mapSightingRow(row);
  }

  async findAll(order: SightingsOrder = 'date'): Promise<Sighting[]> {
    const database = await this.databaseProvider();
    const rows = await database.getAllAsync<unknown>(
      `SELECT ${SELECT_COLUMNS} FROM sightings ORDER BY ${getOrderByClause(order)}`,
    );
    return rows.map(mapSightingRow);
  }

  async findById(id: string): Promise<Sighting | null> {
    const database = await this.databaseProvider();
    const row = await database.getFirstAsync<unknown>(
      `SELECT ${SELECT_COLUMNS} FROM sightings WHERE id = ?`,
      id,
    );
    return row === null ? null : mapSightingRow(row);
  }

  async deleteById(id: string): Promise<boolean> {
    const database = await this.databaseProvider();
    const result = await database.runAsync('DELETE FROM sightings WHERE id = ?', id);
    return result.changes > 0;
  }
}
