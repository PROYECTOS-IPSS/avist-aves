import { weatherDescriptionForCode } from '../weatherCode';

describe('Open-Meteo weather-code mapping', () => {
  it.each([
    [0, 'Despejado'],
    [2, 'Parcialmente nublado'],
    [45, 'Niebla'],
    [51, 'Llovizna'],
    [63, 'Lluvia'],
    [73, 'Nieve'],
    [81, 'Chubascos'],
    [86, 'Chubascos de nieve'],
    [95, 'Tormenta'],
    [99, 'Tormenta con granizo'],
  ])('maps code %s to %s', (code, description) => {
    expect(weatherDescriptionForCode(code)).toBe(description);
  });

  it.each([4, 100, Number.NaN])('uses a safe fallback for unknown code %s', (code) => {
    expect(weatherDescriptionForCode(code)).toBe('Condición desconocida');
  });
});
