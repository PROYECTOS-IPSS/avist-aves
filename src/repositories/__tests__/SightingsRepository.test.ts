import type { SQLiteDatabase } from 'expo-sqlite';

import { SightingsRepository } from '../SightingsRepository';

const validInput = {
  birdName: 'Chucao',
  photoUri: 'file:///test/bird.jpg',
  latitude: -38.7,
  longitude: -72.6,
  locationLabel: null,
  observedAt: '2026-09-14T10:00:00.000Z',
  quantity: 1,
  notes: null,
  temperature: null,
  humidity: null,
  weatherCode: null,
  weatherDescription: null,
};

const completeRow = {
  id: 'sighting-1',
  bird_name: 'Chucao',
  photo_uri: 'file:///test/bird.jpg',
  latitude: -38.7,
  longitude: -72.6,
  location_label: null,
  observed_at: '2026-09-14T10:00:00.000Z',
  quantity: 1,
  notes: null,
  temperature: null,
  humidity: null,
  weather_code: null,
  weather_description: null,
  created_at: '2026-09-14T10:01:00.000Z',
  updated_at: '2026-09-14T10:01:00.000Z',
};

function createTestDatabase(firstRow: unknown = completeRow, rows: unknown[] = []) {
  const methods = {
    runAsync: jest.fn().mockResolvedValue({ changes: 1 }),
    getFirstAsync: jest.fn().mockResolvedValue(firstRow),
    getAllAsync: jest.fn().mockResolvedValue(rows),
  };

  return {
    database: methods as unknown as SQLiteDatabase,
    methods,
  };
}

describe('SightingsRepository input boundary', () => {
  it('rejects invalid quantity before opening SQLite', async () => {
    const repository = new SightingsRepository(async () => {
      throw new Error('SQLite should not open for invalid input');
    });

    await expect(repository.create({ ...validInput, quantity: 0 })).rejects.toThrow(
      'quantity must be an integer greater than or equal to 1',
    );
  });

  it('rejects blank required values before opening SQLite', async () => {
    const repository = new SightingsRepository(async () => {
      throw new Error('SQLite should not open for invalid input');
    });

    await expect(repository.create({ ...validInput, birdName: ' ' })).rejects.toThrow(
      'birdName is required',
    );
  });
});

describe('SightingsRepository injected database boundary', () => {
  it('persists normalized parameters and maps the created row', async () => {
    const { database, methods } = createTestDatabase();
    const repository = new SightingsRepository(async () => database);

    await expect(repository.create({ ...validInput, birdName: ' Chucao ', photoUri: ' file:///test/bird.jpg ' })).resolves.toMatchObject({
      birdName: 'Chucao',
      photoUri: 'file:///test/bird.jpg',
      locationLabel: null,
      quantity: 1,
      temperature: null,
    });

    expect(methods.runAsync).toHaveBeenCalledWith(expect.any(String), [
      expect.any(String),
      'Chucao',
      'file:///test/bird.jpg',
      -38.7,
      -72.6,
      null,
      '2026-09-14T10:00:00.000Z',
      1,
      null,
      null,
      null,
      null,
      null,
      expect.any(String),
      expect.any(String),
    ]);
    expect(methods.getFirstAsync).toHaveBeenCalledWith(expect.any(String), expect.any(String));
  });

  it('returns null for a missing ID without inventing a sighting', async () => {
    const { database, methods } = createTestDatabase(null);
    const repository = new SightingsRepository(async () => database);

    await expect(repository.findById('missing-id')).resolves.toBeNull();
    expect(methods.getFirstAsync).toHaveBeenCalledWith(expect.any(String), 'missing-id');
  });

  it('maps repository list rows through the injected provider', async () => {
    const { database, methods } = createTestDatabase(undefined, [completeRow]);
    const repository = new SightingsRepository(async () => database);

    await expect(repository.findAll('name')).resolves.toMatchObject([{ birdName: 'Chucao', quantity: 1 }]);
    expect(methods.getAllAsync).toHaveBeenCalledWith(expect.any(String));
  });
  it('reports whether a persisted sighting was deleted', async () => {
    const { database, methods } = createTestDatabase();
    const repository = new SightingsRepository(async () => database);

    await expect(repository.deleteById('sighting-1')).resolves.toBe(true);
    expect(methods.runAsync).toHaveBeenCalledWith('DELETE FROM sightings WHERE id = ?', 'sighting-1');
  });
});
