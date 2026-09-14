import type { Sighting, SightingsOrder } from '../domain/sightings';

export type SightingRow = {
  id: unknown;
  bird_name: unknown;
  photo_uri: unknown;
  latitude: unknown;
  longitude: unknown;
  location_label: unknown;
  observed_at: unknown;
  quantity: unknown;
  notes: unknown;
  temperature: unknown;
  humidity: unknown;
  weather_code: unknown;
  weather_description: unknown;
  created_at: unknown;
  updated_at: unknown;
};

const ORDER_BY: Record<SightingsOrder, string> = {
  date: 'observed_at DESC',
  name: 'bird_name COLLATE NOCASE ASC',
  quantity: 'quantity DESC',
};

export function getOrderByClause(order: SightingsOrder = 'date'): string {
  const clause = ORDER_BY[order];
  if (!clause) {
    throw new Error(`Unsupported sightings order: ${String(order)}`);
  }
  return clause;
}

function asRecord(row: unknown): Record<string, unknown> {
  if (typeof row !== 'object' || row === null) {
    throw new Error('Invalid sighting row');
  }
  return row as Record<string, unknown>;
}

function requiredString(row: Record<string, unknown>, key: string): string {
  const value = row[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Invalid sighting ${key}`);
  }
  return value;
}

function nullableString(row: Record<string, unknown>, key: string): string | null {
  const value = row[key];
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== 'string') {
    throw new Error(`Invalid nullable sighting ${key}`);
  }
  return value;
}

function requiredNumber(row: Record<string, unknown>, key: string): number {
  const value = row[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid sighting ${key}`);
  }
  return value;
}

function nullableNumber(row: Record<string, unknown>, key: string): number | null {
  const value = row[key];
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid nullable sighting ${key}`);
  }
  return value;
}

export function mapSightingRow(row: unknown): Sighting {
  const record = asRecord(row);
  const quantity = requiredNumber(record, 'quantity');

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error('Invalid sighting quantity');
  }

  return {
    id: requiredString(record, 'id'),
    birdName: requiredString(record, 'bird_name'),
    photoUri: requiredString(record, 'photo_uri'),
    latitude: requiredNumber(record, 'latitude'),
    longitude: requiredNumber(record, 'longitude'),
    locationLabel: nullableString(record, 'location_label'),
    observedAt: requiredString(record, 'observed_at'),
    quantity,
    notes: nullableString(record, 'notes'),
    temperature: nullableNumber(record, 'temperature'),
    humidity: nullableNumber(record, 'humidity'),
    weatherCode: nullableNumber(record, 'weather_code'),
    weatherDescription: nullableString(record, 'weather_description'),
    createdAt: requiredString(record, 'created_at'),
    updatedAt: requiredString(record, 'updated_at'),
  };
}
