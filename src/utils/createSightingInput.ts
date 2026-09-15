import type { CreateSightingInput } from '../domain/sightings';
import type { SightingDraft, ValidationResult } from '../domain/sightingDraft';
import type { CurrentWeather } from '../services/weatherService';
import { isValidCoordinates } from './locationHelpers';
import { normalizeEditableDraft, validateWholeDraft } from './validateSightingDraft';

export function createSightingInput(
  draft: SightingDraft,
  weather: CurrentWeather | null,
): ValidationResult<CreateSightingInput> {
  const errors = validateWholeDraft(draft);
  const normalized = normalizeEditableDraft(draft);
  const { photoUri, latitude, longitude } = draft;
  const coordinatesValid =
    typeof latitude === 'number' && typeof longitude === 'number' && isValidCoordinates(latitude, longitude);

  if (!normalized.valid || Object.keys(errors).length > 0) {
    return { valid: false, value: null, errors };
  }

  if (!photoUri || !coordinatesValid) {
    return {
      valid: false,
      value: null,
      errors: {
        ...(photoUri ? {} : { photo: 'La fotografía es obligatoria.' }),
        ...(coordinatesValid ? {} : { location: 'La ubicación GPS es obligatoria.' }),
      },
    };
  }


  return {
    valid: true,
    value: {
      birdName: normalized.value.birdName,
      photoUri,
      latitude,
      longitude,
      locationLabel: draft.locationLabel?.trim() || null,
      observedAt: normalized.value.observedAt,
      quantity: normalized.value.quantity,
      notes: normalized.value.notes || null,
      temperature: weather?.temperature ?? null,
      humidity: weather?.humidity ?? null,
      weatherCode: weather?.weatherCode ?? null,
      weatherDescription: weather?.weatherDescription ?? null,
    },
    errors: {},
  };
}
