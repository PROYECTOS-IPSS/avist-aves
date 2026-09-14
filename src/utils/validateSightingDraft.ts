import {
  parseDraftDateTime,
  type NormalizedEditableSightingDraft,
  type SightingDraft,
  type ValidationErrors,
  type ValidationResult,
} from '../domain/sightingDraft';

export function validateEditableDraft(draft: SightingDraft): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!draft.birdName.trim()) {
    errors.birdName = 'Ingresa el nombre del ave o escribe “No identificada”.';
  }

  if (!parseDraftDateTime(draft)) {
    errors.observedAt = 'Usa una fecha válida con formato AAAA-MM-DD y una hora HH:MM.';
  }

  if (!/^\d+$/.test(draft.quantity.trim()) || Number(draft.quantity) < 1) {
    errors.quantity = 'Ingresa un número entero mayor o igual a 1.';
  }

  return errors;
}

export function validateWholeDraft(draft: SightingDraft): ValidationErrors {
  const errors = validateEditableDraft(draft);
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

export function normalizeEditableDraft(draft: SightingDraft): ValidationResult<NormalizedEditableSightingDraft> {
  const errors = validateEditableDraft(draft);
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
