import type { SightingDraft } from '../../domain/sightingDraft';
import { createSightingInput } from '../createSightingInput';

const validDraft: SightingDraft = {
  birdName: ' Chucao ',
  observedDate: '2026-09-14',
  observedTime: '10:05',
  quantity: '2',
  notes: ' Cerca del río ',
  photoUri: 'file:///documents/sightings/photos/photo-1.jpg',
  latitude: -38.7,
  longitude: -72.6,
  locationLabel: 'Temuco, Chile',
};

const weather = {
  temperature: 12.4,
  humidity: 76,
  weatherCode: 3,
  weatherDescription: 'Nublado',
  windSpeed: 8.2,
};

describe('createSightingInput', () => {
  it('maps normalized draft and available weather to repository input', () => {
    expect(createSightingInput(validDraft, weather)).toMatchObject({
      valid: true,
      value: {
        birdName: 'Chucao',
        photoUri: validDraft.photoUri,
        latitude: -38.7,
        longitude: -72.6,
        locationLabel: 'Temuco, Chile',
        quantity: 2,
        notes: 'Cerca del río',
        temperature: 12.4,
        humidity: 76,
        weatherCode: 3,
        weatherDescription: 'Nublado',
      },
    });
  });

  it('keeps weather nullable when weather is unavailable', () => {
    const result = createSightingInput(validDraft, null);

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value.temperature).toBeNull();
      expect(result.value.humidity).toBeNull();
      expect(result.value.weatherCode).toBeNull();
      expect(result.value.weatherDescription).toBeNull();
    }
  });

  it('rejects missing required photo or location before repository use', () => {
    expect(createSightingInput({ ...validDraft, photoUri: null }, null)).toMatchObject({
      valid: false,
      errors: { photo: 'La fotografía es obligatoria.' },
    });
    expect(createSightingInput({ ...validDraft, latitude: null }, null)).toMatchObject({
      valid: false,
      errors: { location: 'La ubicación GPS es obligatoria.' },
    });
  });
});
