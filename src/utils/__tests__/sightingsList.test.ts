import type { Sighting, SightingsSort } from '../../domain/sightings';
import { SIGHTINGS_ORDER_OPTIONS, sightingsOrderLabel, sortSightings } from '../sightingsList';

const sighting = (id: string, birdName: string, quantity: number, observedAt: string): Sighting => ({
  id,
  birdName,
  photoUri: `file:///${id}.jpg`,
  latitude: 0,
  longitude: 0,
  locationLabel: null,
  observedAt,
  quantity,
  notes: null,
  temperature: null,
  humidity: null,
  weatherCode: null,
  weatherDescription: null,
  createdAt: observedAt,
  updatedAt: observedAt,
});

const sightings = [
  sighting('1', 'Águila', 5, '2026-09-14T10:00:00.000Z'),
  sighting('2', 'Cóndor', 20, '2026-09-15T10:00:00.000Z'),
  sighting('3', 'ave', 1, '2026-09-13T10:00:00.000Z'),
];

describe('sightings list ordering', () => {
  it('exposes concise labels for initial sort states', () => {
    expect(SIGHTINGS_ORDER_OPTIONS).toEqual([
      { value: 'date', label: 'Más recientes' },
      { value: 'name', label: 'Nombre A-Z' },
      { value: 'quantity', label: 'Cantidad ↑' },
    ]);
  });

  it.each([
    [{ field: 'name', direction: 'asc' }, 'Nombre A-Z'],
    [{ field: 'name', direction: 'desc' }, 'Nombre Z-A'],
    [{ field: 'quantity', direction: 'desc' }, 'Cantidad ↑'],
    [{ field: 'quantity', direction: 'asc' }, 'Cantidad ↓'],
  ] as const)('labels %j as %s', (sort, label) => {
    expect(sightingsOrderLabel(sort as SightingsSort)).toBe(label);
  });

  it('sorts quantity both directions without mutating source data', () => {
    const source = [...sightings];
    expect(sortSightings(source, { field: 'quantity', direction: 'desc' }).map((item) => item.quantity)).toEqual([20, 5, 1]);
    expect(sortSightings(source, { field: 'quantity', direction: 'asc' }).map((item) => item.quantity)).toEqual([1, 5, 20]);
    expect(source).toEqual(sightings);
  });

  it('sorts Spanish names with accents case-insensitively', () => {
    expect(sortSightings(sightings, { field: 'name', direction: 'asc' }).map((item) => item.birdName)).toEqual(['Águila', 'ave', 'Cóndor']);
    expect(sortSightings(sightings, { field: 'name', direction: 'desc' }).map((item) => item.birdName)).toEqual(['Cóndor', 'ave', 'Águila']);
  });
});
