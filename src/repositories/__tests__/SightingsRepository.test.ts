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
