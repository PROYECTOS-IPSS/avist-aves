import { getOrderByClause, mapSightingRow } from '../sightingMapper';

const completeRow = {
  id: 'sighting-1',
  bird_name: 'Chucao',
  photo_uri: 'file:///test/bird.jpg',
  latitude: -38.7,
  longitude: -72.6,
  location_label: 'Temuco',
  observed_at: '2026-09-14T10:00:00.000Z',
  quantity: 2,
  notes: 'Cerca del sendero',
  temperature: 18.5,
  humidity: 72,
  weather_code: 3,
  weather_description: 'Parcialmente nublado',
  created_at: '2026-09-14T10:01:00.000Z',
  updated_at: '2026-09-14T10:01:00.000Z',
};

describe('mapSightingRow', () => {
  it('maps snake_case fields to the Sighting domain shape', () => {
    expect(mapSightingRow(completeRow)).toEqual({
      id: 'sighting-1',
      birdName: 'Chucao',
      photoUri: 'file:///test/bird.jpg',
      latitude: -38.7,
      longitude: -72.6,
      locationLabel: 'Temuco',
      observedAt: '2026-09-14T10:00:00.000Z',
      quantity: 2,
      notes: 'Cerca del sendero',
      temperature: 18.5,
      humidity: 72,
      weatherCode: 3,
      weatherDescription: 'Parcialmente nublado',
      createdAt: '2026-09-14T10:01:00.000Z',
      updatedAt: '2026-09-14T10:01:00.000Z',
    });
  });

  it('preserves nullable weather and location values', () => {
    expect(
      mapSightingRow({
        ...completeRow,
        location_label: null,
        notes: null,
        temperature: null,
        humidity: null,
        weather_code: null,
        weather_description: null,
      }),
    ).toMatchObject({
      locationLabel: null,
      notes: null,
      temperature: null,
      humidity: null,
      weatherCode: null,
      weatherDescription: null,
    });
  });
});

describe('getOrderByClause', () => {
  it('uses newest-first date ordering by default', () => {
    expect(getOrderByClause()).toBe('observed_at DESC');
  });

  it.each([
    ['name', 'bird_name COLLATE NOCASE ASC'],
    ['quantity', 'quantity DESC'],
  ] as const)('maps %s to a fixed SQL fragment', (order, clause) => {
    expect(getOrderByClause(order)).toBe(clause);
  });

  it('rejects an order value outside the whitelist', () => {
    expect(() => getOrderByClause('observed_at; DROP TABLE sightings' as never)).toThrow(
      'Unsupported sightings order',
    );
  });
});

describe('mapSightingRow validation', () => {
  it.each([
    [null, 'Invalid sighting row'],
    [{ ...completeRow, id: '' }, 'Invalid sighting id'],
    [{ ...completeRow, bird_name: '' }, 'Invalid sighting bird_name'],
    [{ ...completeRow, latitude: 'not-a-number' }, 'Invalid sighting latitude'],
    [{ ...completeRow, quantity: 1.5 }, 'Invalid sighting quantity'],
    [{ ...completeRow, notes: 42 }, 'Invalid nullable sighting notes'],
  ])('rejects malformed row with %s', (row, message) => {
    expect(() => mapSightingRow(row)).toThrow(message);
  });
});
