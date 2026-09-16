# P12 Implementation

## Audited and already correct

- `AppScreen` already used safe-area edges on top and bottom, a paper background, scrollable registration content, and `keyboardShouldPersistTaps="handled"`.
- `AppHeader` already provided a consistent custom header and 48dp back target.
- `PrimaryButton` already gave primary actions a large field-notebook treatment and 56dp minimum height.
- Home already had a prominent registration CTA, intentional empty state, retry state, sort choices, and refresh copy.
- Registration already kept visible labels/helpers/errors, useful keyboard types, multiline notes, camera-only capture, human-readable GPS result, optional weather, validation, and duplicate-save protection.
- Camera and location components already contained permission recovery and user-facing failure text.
- Detail already prioritized bird/photo/date/location/history/quantity/notes and used a deliberate broken-photo block.
- P10 hooks already owned stale-request protection and coherent list/detail/weather statuses.

## Changed in P12

### Shared controls and semantics

- `src/components/PrimaryButton.tsx`: optional accessibility hint and busy state; explicit accessible label/state; stronger sage/pine disabled treatment.
- `src/components/AppHeader.tsx`: back navigation hint.
- `src/components/FormField.tsx`: required fields say `obligatorio`; validation messages use polite live-region semantics.
- `src/components/AppScreen.tsx`: registration scroll dismisses keyboard on drag.

### Home and reusable card

- `app/index.tsx`: loading/error announcements, retry hint, explicit sort group, radio selection hints, and CTA hint.
- `src/components/SightingCard.tsx`: complete card announcement, detail hint, decorative nested image, two-line bird/location resilience.

### Registration capture and save

- `src/components/CameraCapture.tsx`: status/error announcements, busy capture/accept semantics, and 48dp cancel actions.
- `src/components/LocationCapture.tsx`: live GPS result/error semantics, action hint, and settings hint.
- `src/components/WeatherStatus.tsx`: restrained state-specific surfaces, loading indicator, and live status updates.
- `app/sightings/new.tsx`: actual save failure message, retry wording, save live status, busy semantics, and no change to camera/GPS/weather/persistence flow.

### Detail

- `app/sightings/[id].tsx`: announced loading/error states, accessible broken-photo fallback, explicit secondary coordinate wording, and unchanged historical-weather grouping.

## Decision boundary

P12 uses existing NativeWind tokens and React Native primitives. No design-system abstraction, icon dependency, picker replacement, keyboard library, or native rebuild was necessary.
