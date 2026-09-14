import {
  formatLocationLabel,
  isValidCoordinates,
} from '../locationHelpers';

describe('coordinate validation', () => {
  it.each([
    [-90, -180],
    [0, 0],
    [90, 180],
  ])('accepts valid boundary coordinates: %s, %s', (latitude, longitude) => {
    expect(isValidCoordinates(latitude, longitude)).toBe(true);
  });

  it.each([
    [-90.1, 0],
    [90.1, 0],
    [0, -180.1],
    [0, 180.1],
    [Number.NaN, 0],
    [0, Number.POSITIVE_INFINITY],
  ])('rejects invalid coordinates: %s, %s', (latitude, longitude) => {
    expect(isValidCoordinates(latitude, longitude)).toBe(false);
  });
});

describe('human-readable location labels', () => {
  it('orders useful address fields and ignores empty values', () => {
    expect(
      formatLocationLabel({
        streetNumber: '123',
        street: 'Av. Providencia',
        district: '',
        city: 'Providencia',
        region: 'Región Metropolitana',
        country: 'Chile',
      }),
    ).toBe('123 Av. Providencia, Providencia, Región Metropolitana, Chile');
  });

  it('removes duplicate components case-insensitively', () => {
    expect(formatLocationLabel({ city: 'Temuco', subregion: 'temuco', country: 'Chile' })).toBe('Temuco, Chile');
  });

  it.each([null, {}, { city: '   ' }])('uses safe fallback for empty reverse-geocode data: %j', (address) => {
    expect(formatLocationLabel(address)).toBe('Ubicación obtenida');
  });
});
