import { SIGHTINGS_ORDER_OPTIONS, sightingsOrderLabel } from '../sightingsList';

describe('sightings list ordering', () => {
  it('exposes only the repository whitelist with user-facing labels', () => {
    expect(SIGHTINGS_ORDER_OPTIONS).toEqual([
      { value: 'date', label: 'Más recientes' },
      { value: 'name', label: 'Nombre A–Z' },
      { value: 'quantity', label: 'Mayor cantidad' },
    ]);
  });

  it.each([
    ['date', 'Más recientes'],
    ['name', 'Nombre A–Z'],
    ['quantity', 'Mayor cantidad'],
  ] as const)('labels repository order %s', (order, label) => {
    expect(sightingsOrderLabel(order)).toBe(label);
  });
});
