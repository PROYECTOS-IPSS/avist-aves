import {
  createInitialSightingDraft,
  type SightingDraft,
} from '../../domain/sightingDraft';
import {
  normalizeEditableDraft,
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
});

describe('sighting editable validation', () => {
  it.each(['', '   '])('rejects blank bird names: %j', (birdName) => {
    expect(validateEditableDraft({ ...baseDraft, birdName }).birdName).toBeDefined();
  });

  it('accepts ordinary names and No identificada', () => {
    expect(validateEditableDraft(baseDraft)).toEqual({});
    expect(validateEditableDraft({ ...baseDraft, birdName: 'No identificada' })).toEqual({});
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
