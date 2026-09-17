# P16 — Media UX and temporal validation

## Implementation

- Added presentation-only `FormInfo` and reused it for location and photo guidance.
- Added Expo SDK 57-compatible `expo-image-picker` `~57.0.17`.
- Photo actions are explicit: `Tomar foto` and `Elegir de galería`.
- Gallery accepts images only, requests media-library permission contextually, preserves the previous photo on cancellation or denial, and keeps camera available after denial.
- Camera and gallery URIs converge through `persistSelectedPhoto`, the existing application-controlled photo directory, and the same draft `photoUri` field.
- Existing remove, replace, required-photo validation, and camera flow remain intact.
- Domain validation now compares combined local date/time against an injectable `now` value and rejects future timestamps with: `La fecha y hora del avistamiento no pueden estar en el futuro.`
- Native date pickers receive a maximum date of today where supported; domain validation remains the source of truth for future time on today.
- Weather, GPS requirements, persistence, and navigation semantics were not changed.

## Dependency/configuration

- Added `expo-image-picker` `~57.0.17` using the Expo SDK 57-compatible package version.
- Added its config plugin with Spanish photo permission text and `microphonePermission: false`.
- No EAS or Android native build was run.

## Automated verification

- `npx --yes yarn typecheck` — PASS
- `npx --yes yarn lint` — PASS
- `npx --yes yarn test` — PASS; 14 suites, 126 tests

Focused timestamp tests use deterministic local `Date` values. Native picker, permission, camera, gallery, and restart persistence behavior remains manual-only.

## P16.1 implementation

- Camera permission is checked/requested from `Tomar foto` before mounting the camera. Denial preserves camera and gallery as independent actions; blocked permissions expose `Abrir ajustes`.
- SDK 57 image-only Android gallery flow launches `expo-image-picker` directly through Android Photo Picker. The installed `expo-image-picker` Android contract uses `PickVisualMedia`, so no broad storage/media permission is requested on Android. iOS still checks/requests media-library permission because that platform/API requires it.
- Photo now uses one rounded informational container with both actions inside. Camera-denial copy now acknowledges gallery selection.
- Save validation records measured Photo/Location layouts, centers the missing region with a clamped `ScrollView.scrollTo`, and runs a short reusable scale pulse on each missing block.
- `SightingsRepository.deleteById` plus `deleteSighting` is the shared delete path for list and detail. Successful record deletion best-effort deletes only app-owned `document/sightings/photos/photo-*` files; external/gallery URIs are ignored. File cleanup failure does not corrupt the SQLite record.
- Card and detail deletes share the same confirmation modal. Detail returns to the list only after persistence deletion succeeds.

No EAS, Gradle, or Android build was run.
