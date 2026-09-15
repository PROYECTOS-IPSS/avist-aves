import { formatObservedAt, formatQuantity, formatTemperature } from '../formatSighting';

describe('sighting presentation formatters', () => {
  it('formats an observation timestamp for people', () => {
    expect(formatObservedAt('2026-09-14T18:42:00')).toBe('14 sep 2026 · 18:42');
  });

  it('falls back for invalid timestamps', () => {
    expect(formatObservedAt('not-a-date')).toBe('Fecha no disponible');
  });

  it.each([
    [12.4, '12.4 °C'],
    [0, '0.0 °C'],
    [null, 'Clima no disponible'],
  ])('formats temperature %s', (value, expected) => {
    expect(formatTemperature(value)).toBe(expected);
  });

  it.each([
    [1, '1 ave'],
    [3, '3 aves'],
  ])('formats quantity %s', (value, expected) => {
    expect(formatQuantity(value)).toBe(expected);
  });
});
