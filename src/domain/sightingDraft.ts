export type SightingDraft = {
  birdName: string;
  observedDate: string;
  observedTime: string;
  quantity: string;
  notes: string;
  photoUri: string | null;
  latitude: number | null;
  longitude: number | null;
  locationLabel: string | null;
};

export type NormalizedEditableSightingDraft = {
  birdName: string;
  observedAt: string;
  quantity: number;
  notes: string;
};

export type DraftErrorField = 'birdName' | 'observedAt' | 'quantity' | 'photo' | 'location';

export type ValidationErrors = Partial<Record<DraftErrorField, string>>;

export type ValidationResult<T> =
  | { valid: true; value: T; errors: Record<string, never> }
  | { valid: false; value: null; errors: ValidationErrors };

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

export function formatDraftDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatDraftTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatDraftDateForDisplay(date: Date): string {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function createInitialSightingDraft(now = new Date()): SightingDraft {
  return {
    birdName: '',
    observedDate: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    observedTime: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    quantity: '1',
    notes: '',
    photoUri: null,
    latitude: null,
    longitude: null,
    locationLabel: null,
  };
}

export function parseDraftDateTime(draft: Pick<SightingDraft, 'observedDate' | 'observedTime'>): Date | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(draft.observedDate.trim());
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(draft.observedTime.trim());

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const parsed = new Date(year, month - 1, day, hours, minutes);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hours ||
    parsed.getMinutes() !== minutes
  ) {
    return null;
  }

  return parsed;
}
