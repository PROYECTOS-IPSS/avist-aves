import { isCurrentWeatherRequest } from '../useWeatherForLocation';

describe('weather request ownership', () => {
  it('accepts only the latest request version', () => {
    expect(isCurrentWeatherRequest(3, 3)).toBe(true);
    expect(isCurrentWeatherRequest(2, 3)).toBe(false);
  });
});
