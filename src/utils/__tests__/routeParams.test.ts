import { normalizeRouteId } from '../routeParams';

describe('detail route ID normalization', () => {
  it.each<[string | string[], string]>([
    ['sighting-1', 'sighting-1'],
    [['sighting-2', 'ignored'], 'sighting-2'],
  ])('normalizes valid route value %j', (raw, expected) => {
    expect(normalizeRouteId(raw)).toBe(expected);
  });

  it.each([undefined, '', '   ', [], ['']])('rejects missing or empty route value %j', (raw) => {
    expect(normalizeRouteId(raw)).toBeNull();
  });

  it('rejects an unexpectedly long route value', () => {
    expect(normalizeRouteId('x'.repeat(201))).toBeNull();
  });
});
