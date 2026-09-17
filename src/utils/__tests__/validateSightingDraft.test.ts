import {
  createInitialSightingDraft,
  formatDraftDate,
  formatDraftDateForDisplay,
  formatDraftTime,
  type SightingDraft,
} from '../../domain/sightingDraft';
import {
  BIRD_NAME_MAX_LENGTH,
  normalizeEditableDraft,
  sanitizeBirdName,
  validateEditableDraft,
  validateWholeDraft,
} from '../validateSightingDraft';

const baseDraft: SightingDraft = {
  birdName: 'Chucao',
  observedDate: '2026-09-14',
  observedTime: '10:05',
  quantity: '1',
  notes: '',
  photoUri: null,
  latitude: null,
  longitude: null,
  locationLabel: null,
};

describe('sighting draft initialization and normalization', () => {
  it('initializes editable date/time once with quantity one', () => {
    expect(createInitialSightingDraft(new Date(2026, 8, 14, 10, 5))).toMatchObject({
      observedDate: '2026-09-14',
      observedTime: '10:05',
      quantity: '1',
      birdName: '',
      notes: '',
      photoUri: null,
      latitude: null,
      longitude: null,
      locationLabel: null,
    });
  });

  it('trims free text and normalizes editable values to domain-friendly values', () => {
    const result = normalizeEditableDraft({
      ...baseDraft,
      birdName: '  No identificada  ',
      notes: '  Cerca del río  ',
      quantity: '2',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value.birdName).toBe('No identificada');
      expect(result.value.notes).toBe('Cerca del río');
      expect(result.value.quantity).toBe(2);
      expect(result.value.observedAt).toBe(new Date(2026, 8, 14, 10, 5).toISOString());
    }
  });

  it('formats native picker values for storage and display', () => {
    const picked = new Date(2026, 8, 14, 7, 5);
    expect(formatDraftDate(picked)).toBe('2026-09-14');
    expect(formatDraftTime(picked)).toBe('07:05');
    expect(formatDraftDateForDisplay(picked)).toBe('14/09/2026');
  });
});

describe('sighting editable validation', () => {
  it.each(['', '   '])('rejects blank bird names: %j', (birdName) => {
    expect(validateEditableDraft({ ...baseDraft, birdName }).birdName).toBeDefined();
  });

  it('accepts accented names, spaces, numbers, #, &, and no identificada', () => {
    expect(validateEditableDraft({ ...baseDraft, birdName: 'Martín & Martín 2 #1' }).birdName).toBeUndefined();
    expect(validateEditableDraft({ ...baseDraft, birdName: 'No identificada' })).toEqual({});
  });

  it.each(['Cóndor!!!', 'Ave???', 'Tiuque@Sur'])('rejects unsupported bird names: %s', (birdName) => {
    expect(validateEditableDraft({ ...baseDraft, birdName }).birdName).toBeDefined();
  });

  it('accepts a bird name with exactly 50 characters', () => {
    expect(validateEditableDraft({ ...baseDraft, birdName: 'A'.repeat(BIRD_NAME_MAX_LENGTH) }).birdName).toBeUndefined();
  });

  it('rejects 51 characters with the correct limit message', () => {
    expect(
      validateEditableDraft({ ...baseDraft, birdName: 'A'.repeat(BIRD_NAME_MAX_LENGTH + 1) }).birdName,
    ).toBe('Usa hasta 50 caracteres: letras, números, espacios, # o &.');
  });

  it('sanitizes invalid input during entry and caps it at 50 characters', () => {
    expect(sanitizeBirdName('Cóndor!!! @ Sur')).toBe('Cóndor  Sur');
    expect(Array.from(sanitizeBirdName('A'.repeat(60))).length).toBe(BIRD_NAME_MAX_LENGTH);
  });

  it.each(['', '0', '-1', '1.5', 'abc', '2e2'])('rejects invalid quantities: %j', (quantity) => {
    expect(validateEditableDraft({ ...baseDraft, quantity }).quantity).toBeDefined();
  });

  it.each(['1', '2', '100'])('accepts integer quantities: %j', (quantity) => {
    expect(validateEditableDraft({ ...baseDraft, quantity }).quantity).toBeUndefined();
  });

  it.each([
    ['2026-02-30', '10:05'],
    ['2026-09-14', '24:00'],
    ['14-09-2026', '10:05'],
  ])('rejects invalid date/time: %s %s', (observedDate, observedTime) => {
    expect(validateEditableDraft({ ...baseDraft, observedDate, observedTime }).observedAt).toBeDefined();
  });

  it('accepts past and current timestamps using injected local time', () => {
    const now = new Date(2026, 8, 16, 21, 30);
    expect(validateEditableDraft({ ...baseDraft, observedDate: '2026-09-15', observedTime: '23:00' }, now).observedAt).toBeUndefined();
    expect(validateEditableDraft({ ...baseDraft, observedDate: '2026-09-16', observedTime: '21:30' }, now).observedAt).toBeUndefined();
  });

  it.each([
    ['2026-09-16', '21:31'],
    ['2026-09-17', '10:00'],
  ])('rejects future timestamp %s %s with Spanish error', (observedDate, observedTime) => {
    expect(validateEditableDraft({ ...baseDraft, observedDate, observedTime }, new Date(2026, 8, 16, 21, 30))).toMatchObject({
      observedAt: 'La fecha y hora del avistamiento no pueden estar en el futuro.',
    });
  });
});

describe('whole draft validation', () => {
  it('reports missing photo and GPS without inventing values', () => {
    expect(validateWholeDraft(baseDraft)).toEqual({
      photo: 'La fotografía es obligatoria.',
      location: 'La ubicación GPS es obligatoria.',
    });
  });

  it('accepts coordinate boundary values once native prerequisites exist', () => {
    expect(
      validateWholeDraft({
        ...baseDraft,
        photoUri: 'file:///test/bird.jpg',
        latitude: 90,
        longitude: -180,
      }),
    ).toEqual({});
  });

  it('rejects coordinates outside domain bounds', () => {
    expect(
      validateWholeDraft({ ...baseDraft, photoUri: 'file:///test/bird.jpg', latitude: 90.1, longitude: 0 }).location,
    ).toBe('La ubicación GPS es obligatoria.');
  });
});
