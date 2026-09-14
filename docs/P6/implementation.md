# P6 Implementation

## Expo Location API

`src/services/locationService.ts` uses Expo SDK 57 `expo-location` APIs:

- `getForegroundPermissionsAsync()` checks existing foreground permission.
- `requestForegroundPermissionsAsync()` requests permission only after `Obtener ubicación` is activated.
- `getCurrentPositionAsync({ accuracy: LocationAccuracy.Balanced, mayShowUserSettingsDialog: true })` performs one current-position acquisition.
- `reverseGeocodeAsync({ latitude, longitude })` resolves a human-readable address.

No background permission, location watcher, geofence, or continuous update API is used.

## Permission and acquisition state

`src/hooks/useLocationCapture.ts` orchestrates:

`idle → requestingPermission → acquiring → success`

with `denied` and `error` branches. Permission denial is non-fatal. A permanently blocked permission exposes an Android settings action through `Linking.openSettings()`.

The hook prevents duplicate operations with an in-flight operation reference. Native location acquisition has a 15-second UI timeout. The native request remains tracked after timeout, so retry cannot start a parallel acquisition while the previous native request is still settling.

## Accuracy and coordinate validation

Balanced accuracy is appropriate for a single bird-sighting position without the power cost of highest/navigation accuracy. `getCurrentLocation()` validates latitude and longitude before returning them:

- latitude: `[-90, 90]`
- longitude: `[-180, 180]`
- both finite numbers

Invalid or missing coordinates become an acquisition error. No manual coordinate input or fabricated fallback exists.

## Reverse geocoding and label formatting

Valid coordinates are reverse-geocoded once. `formatLocationLabel()` in `src/utils/locationHelpers.ts` combines available values in readable order:

`streetNumber + street`, district, city, subregion, region, country.

Empty fields are ignored. Duplicate components are removed case-insensitively, preferring city over duplicate administrative values. Empty results and reverse-geocode failures use `Ubicación obtenida`. Valid coordinates remain accepted when geocoding fails.

The UI makes the human-readable label primary. Coordinates are secondary, rounded to four decimals for display while full numeric values remain in the draft.

## Draft integration and refresh semantics

`SightingDraft` now contains `locationLabel: string | null` beside existing nullable latitude and longitude. `LocationCapture` calls the screen callback only after valid coordinates and a fallback/real label are available. The screen then updates latitude, longitude, and label in the existing draft state; photo and all editable fields remain untouched.

`Actualizar ubicación` keeps the previous valid draft location until a replacement coordinate succeeds. Permission, GPS, timeout, and reverse-geocoding failures do not clear an existing location.

A missing reverse-geocode label does not make valid coordinates invalid. Whole-draft validation continues to require coordinates, not label text alone.

## UI and accessibility

The location field is marked `Ubicación *`, explains automatic GPS acquisition, disables its action while permission/acquisition is active, exposes readable errors, and provides settings guidance when permission is permanently blocked. No coordinate text inputs exist. P12 remains outside scope.

## Save deferral

P6 does not call `SightingsRepository.create`, insert SQLite rows, show save success, or navigate after save. Weather and final registration orchestration remain P7/future scope even when photo and GPS prerequisites are present.

## Native configuration

`app.json` adds:

```json
[
  "expo-location",
  {
    "locationWhenInUsePermission": "AvistAves necesita tu ubicación para registrar dónde observaste el ave."
  }
]
```

No background location permission or unrelated native permission was added.
