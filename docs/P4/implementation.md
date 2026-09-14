# P4 Implementation

## Form state architecture

`src/domain/sightingDraft.ts` separates editable UI state from persistence/domain state:

- `SightingDraft` keeps date, time, and quantity as input-friendly strings.
- `NormalizedEditableSightingDraft` exposes trimmed text, numeric quantity, and ISO `observedAt`.
- `ValidationErrors` provides typed field-level errors.
- `ValidationResult<T>` returns expected invalid input as data instead of throwing.

Initial state is created once by `useState(() => createInitialSightingDraft())`:

- empty bird name;
- current local date/time split into editable `YYYY-MM-DD` and `HH:MM` values;
- quantity `"1"`;
- empty notes;
- `photoUri`, latitude, and longitude set to `null`.

## Hook and validation

`src/hooks/useSightingForm.ts` owns draft updates, touched fields, submitted state, visible errors, editable validation, and whole-draft validation. It is a focused custom hook, not a generic form engine.

`src/utils/validateSightingDraft.ts` provides pure functions:

- `validateEditableDraft` checks bird name, date/time, and quantity.
- `validateWholeDraft` adds required photo and GPS checks.
- `normalizeEditableDraft` trims values, converts quantity to number, and converts local date/time to ISO-8601.

Errors appear after field interaction and become fully visible after validation submission state. Notes remain optional and are trimmed only during normalization.

## Field behavior

- **Bird name:** controlled free text, required, whitespace-only invalid, no species catalogue.
- **Date:** controlled editable text using `YYYY-MM-DD`.
- **Time:** controlled editable text using `HH:MM`.
- **Quantity:** controlled numeric text, integer >= 1; keyboard hint does not replace validation.
- **Notes:** controlled multiline optional text area.
- **Photo/location:** required status cards with `null` state; no fake URI or coordinates.

## Date/time decision

P4 uses two native `TextInput` controls instead of adding a date/time picker dependency. This keeps the small form dependency-free, makes both values visibly editable, and allows deterministic validation/ISO normalization. Native picker UX can be evaluated later only if Android manual testing shows a real need.

## Screen integration

`app/sightings/new.tsx` preserves P3's field-notebook palette and reusable components. It adds real inputs and inline errors while keeping photo/GPS acquisition deferred. The final `PrimaryButton` is disabled and communicates why saving is unavailable. It does not call `SightingsRepository.create`, navigate after save, or show success.

`AppScreen` now keeps keyboard taps usable while its scroll container remains safe-area aware.

## Accessibility baseline

- Labels use `nativeID` and inputs use `accessibilityLabelledBy`.
- Inputs expose meaningful `accessibilityLabel` values.
- Required state is textually marked with `*` and helper copy.
- Errors use `accessibilityRole="alert"`.
- Touch/input controls retain comfortable sizes and readable text.
- P12 remains future full audit scope.

## Testing

`src/utils/__tests__/validateSightingDraft.test.ts` covers initialization, trimming, `No identificada`, blank names, quantity boundaries/malformed input, invalid dates/times, ISO normalization, missing photo/GPS, and coordinate boundaries. Existing P2 tests remain unchanged and passing.
