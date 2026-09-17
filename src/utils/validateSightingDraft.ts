import {
  parseDraftDateTime,
  type NormalizedEditableSightingDraft,
  type SightingDraft,
  type ValidationErrors,
  type ValidationResult,
} from '../domain/sightingDraft';

export const BIRD_NAME_MAX_LENGTH = 30;

export function sanitizeBirdName(value: string): string {
  return Array.from(value.replace(/[^\p{L}\p{M}\p{N} #&]/gu, '')).slice(0, BIRD_NAME_MAX_LENGTH).join('');
}

function hasValidBirdNameCharacters(value: string): boolean {
  return sanitizeBirdName(value) === value && Array.from(value).length <= BIRD_NAME_MAX_LENGTH;
}

export function validateEditableDraft(draft: SightingDraft, now = new Date()): ValidationErrors {
  const errors: ValidationErrors = {};
  const observedAt = parseDraftDateTime(draft);

  if (!draft.birdName.trim()) {
    errors.birdName = 'Ingresa el nombre del ave o escribe “No identificada”.';
  } else if (!hasValidBirdNameCharacters(draft.birdName)) {
    errors.birdName = 'Usa hasta 30 caracteres: letras, números, espacios, # o &.';
  }

  if (!observedAt) {
    errors.observedAt = 'Usa una fecha válida con formato AAAA-MM-DD y una hora HH:MM.';
  } else if (observedAt.getTime() > now.getTime()) {
    errors.observedAt = 'La fecha y hora del avistamiento no pueden estar en el futuro.';
  }

  if (!/^\d+$/.test(draft.quantity.trim()) || Number(draft.quantity) < 1) {
    errors.quantity = 'Ingresa un número entero mayor o igual a 1.';
  }

  return errors;
}

export function validateWholeDraft(draft: SightingDraft, now = new Date()): ValidationErrors {
  const errors = validateEditableDraft(draft, now);
  if (!draft.photoUri) {
    errors.photo = 'La fotografía es obligatoria.';
  }

  const hasValidLatitude =
    typeof draft.latitude === 'number' && Number.isFinite(draft.latitude) && draft.latitude >= -90 && draft.latitude <= 90;
  const hasValidLongitude =
    typeof draft.longitude === 'number' && Number.isFinite(draft.longitude) && draft.longitude >= -180 && draft.longitude <= 180;

  if (!hasValidLatitude || !hasValidLongitude) {
    errors.location = 'La ubicación GPS es obligatoria.';
  }

  return errors;
}

export function normalizeEditableDraft(draft: SightingDraft, now = new Date()): ValidationResult<NormalizedEditableSightingDraft> {
  const errors = validateEditableDraft(draft, now);
  const observedAt = parseDraftDateTime(draft);

  if (Object.keys(errors).length > 0 || !observedAt) {
    return { valid: false, value: null, errors };
  }

  return {
    valid: true,
    value: {
      birdName: draft.birdName.trim(),
      observedAt: observedAt.toISOString(),
      quantity: Number(draft.quantity),
      notes: draft.notes.trim(),
    },
    errors: {},
  };
}
