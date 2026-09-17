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
