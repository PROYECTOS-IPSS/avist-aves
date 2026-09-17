import {
  clearWeatherCache,
  fetchCurrentWeather,
  parseCurrentWeather,
  type WeatherFetcher,
  type WeatherResponse,
} from '../weatherService';

const validPayload = {
  current: {
    temperature_2m: 12.4,
    relative_humidity_2m: 76,
    weather_code: 3,
    wind_speed_10m: 8.2,
  },
};

const coordinates = { latitude: -33.43, longitude: -70.61 };

function response(body: unknown, status = 200): WeatherResponse {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

describe('Open-Meteo parsing', () => {
  it('maps validated current fields to the app weather model', () => {
    expect(parseCurrentWeather(validPayload)).toEqual({
      temperature: 12.4,
      humidity: 76,
      weatherCode: 3,
      weatherDescription: 'Nublado',
      windSpeed: 8.2,
    });
  });

  it.each([
    {},
    { current: { relative_humidity_2m: 76, weather_code: 3 } },
    { current: { temperature_2m: '12', relative_humidity_2m: 76, weather_code: 3 } },
    { current: { temperature_2m: 12, relative_humidity_2m: 76, weather_code: 3.5 } },
  ])('rejects malformed response %j', (payload) => {
    expect(parseCurrentWeather(payload)).toBeNull();
  });
});

describe('Open-Meteo request policy', () => {
  beforeEach(() => clearWeatherCache());

  it('retries one transient failure and then returns weather', async () => {
    const fetcher = jest.fn() as unknown as jest.MockedFunction<WeatherFetcher>;
    fetcher.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(response(validPayload));

    await expect(fetchCurrentWeather(coordinates, { fetcher })).resolves.toMatchObject({ weatherCode: 3 });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('stops after one retry and does not retry ordinary client errors', async () => {
    const transientFetcher = jest.fn() as unknown as jest.MockedFunction<WeatherFetcher>;
    transientFetcher.mockRejectedValue(new Error('offline'));
    const clientFetcher = jest.fn() as unknown as jest.MockedFunction<WeatherFetcher>;
    clientFetcher.mockResolvedValue(response({}, 400));

    await expect(fetchCurrentWeather(coordinates, { fetcher: transientFetcher })).resolves.toBeNull();
    await expect(fetchCurrentWeather({ latitude: -33.44, longitude: -70.61 }, { fetcher: clientFetcher })).resolves.toBeNull();
    expect(transientFetcher).toHaveBeenCalledTimes(2);
    expect(clientFetcher).toHaveBeenCalledTimes(1);
  });

  it('caches same coordinate bucket and refetches expired data', async () => {
    let now = 1_000;
    const fetcher = jest.fn() as unknown as jest.MockedFunction<WeatherFetcher>;
    fetcher.mockResolvedValue(response(validPayload));

    await fetchCurrentWeather(coordinates, { fetcher, now: () => now });
    await fetchCurrentWeather({ latitude: -33.4304, longitude: -70.6104 }, { fetcher, now: () => now });
    expect(fetcher).toHaveBeenCalledTimes(1);

    now += 10 * 60 * 1000 + 1;
    await fetchCurrentWeather(coordinates, { fetcher, now: () => now });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('bounds timeout and still caps retries', async () => {
    const fetcher: WeatherFetcher = (_url, init) =>
      new Promise((_, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
      });

    await expect(fetchCurrentWeather(coordinates, { fetcher, timeoutMs: 1 })).resolves.toBeNull();
  });
  it('requests only the current weather fields used by the app', async () => {
    const fetcher = jest.fn() as unknown as jest.MockedFunction<WeatherFetcher>;
    fetcher.mockResolvedValue(response(validPayload));

    await fetchCurrentWeather(coordinates, { fetcher });

    const [url] = fetcher.mock.calls[0];
    expect(url).toContain('current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m');
    expect(url).not.toContain('hourly=');
    expect(url).not.toContain('daily=');
  });

  it('does not cache failed responses', async () => {
    const fetcher = jest.fn() as unknown as jest.MockedFunction<WeatherFetcher>;
    fetcher.mockResolvedValue(response({}, 400));

    await fetchCurrentWeather(coordinates, { fetcher });
    await fetchCurrentWeather(coordinates, { fetcher });

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it.each([429, 500, 503])('retries recoverable HTTP status %s once', async (status) => {
    const fetcher = jest.fn() as unknown as jest.MockedFunction<WeatherFetcher>;
    fetcher.mockResolvedValueOnce(response({}, status)).mockResolvedValueOnce(response(validPayload));

    await expect(fetchCurrentWeather(coordinates, { fetcher })).resolves.toMatchObject({ weatherCode: 3 });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('does not retry a malformed successful response', async () => {
    const fetcher = jest.fn() as unknown as jest.MockedFunction<WeatherFetcher>;
    fetcher.mockResolvedValue(response({ current: { relative_humidity_2m: 76, weather_code: 3 } }));

    await expect(fetchCurrentWeather(coordinates, { fetcher })).resolves.toBeNull();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
