import { useMemo, useState } from 'react';

import {
  createInitialSightingDraft,
  type SightingDraft,
  type ValidationErrors,
} from '../domain/sightingDraft';
import { validateEditableDraft, validateWholeDraft } from '../utils/validateSightingDraft';

type EditableField = 'birdName' | 'observedDate' | 'observedTime' | 'quantity' | 'notes';
type TouchedFields = Partial<Record<EditableField, boolean>>;

function visibleErrors(
  errors: ValidationErrors,
  touched: TouchedFields,
  submitted: boolean,
): ValidationErrors {
  if (submitted) {
    return errors;
  }

  const visible: ValidationErrors = {};
  if (touched.birdName && errors.birdName) visible.birdName = errors.birdName;
  if ((touched.observedDate || touched.observedTime) && errors.observedAt) {
    visible.observedAt = errors.observedAt;
  }
  if (touched.quantity && errors.quantity) visible.quantity = errors.quantity;
  return visible;
}

export function useSightingForm() {
  const [draft, setDraft] = useState<SightingDraft>(() => createInitialSightingDraft());
  const [touched, setTouched] = useState<TouchedFields>({});
  const [submitted, setSubmitted] = useState(false);

  const allEditableErrors = useMemo(() => validateEditableDraft(draft), [draft]);
  const errors = visibleErrors(allEditableErrors, touched, submitted);

  function setField<K extends keyof SightingDraft>(field: K, value: SightingDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function touchField(field: EditableField) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function validateForProgress() {
    setSubmitted(true);
    return validateEditableDraft(draft);
  }

  function validateForSave() {
    setSubmitted(true);
    return validateWholeDraft(draft);
  }

  return {
    draft,
    errors,
    setField,
    touchField,
    validateForProgress,
    validateForSave,
    hasEditableErrors: Object.keys(allEditableErrors).length > 0,
  };
}
