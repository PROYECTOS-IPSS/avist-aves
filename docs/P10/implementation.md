# P10 Implementation

## Permission recovery

Context7 SDK 57 verification confirmed `useCameraPermissions` exposes permission response plus request/get methods, and `PermissionResponse.canAskAgain` identifies Settings recovery. `useForegroundPermissions`/foreground permission methods expose the equivalent location behavior.

`CameraCapture` now subscribes to React Native `AppState`. When app becomes active after Settings, it calls Expo Camera's permission getter so stale denial state can recover without polling. Existing point-of-use request, rationale, requestable retry, blocked Settings action, camera busy guard, and no-gallery behavior remain unchanged.

`useLocationCapture` now subscribes to `AppState` and refreshes foreground permission after the app becomes active. It updates blocked/recovery state without requesting permission automatically. Existing requestable denial, blocked Settings action, bounded acquisition, duplicate guard, and no manual coordinates remain unchanged.

`app.json` was not changed: camera rationale and foreground-only location rationale were already correct; no gallery, microphone, or background location permission exists.

## Async/error fixes

### Weather

`useWeatherForLocation` now assigns a monotonically increasing request version whenever a new coordinate key starts. Same-key in-flight requests are reused. Different-location requests get a new version; older success/failure results return without mutating current weather state. This prevents old-location weather from appearing for a newer location or entering the final save snapshot.

Existing WeatherService timeout, retry, cache, parser validation, and nullable failure semantics remain unchanged.

### List

`useSightingsList` still invalidates superseded/focused-out results with request versions and reuses same-order in-flight work. P10 stops clearing existing real rows at load start. Home keeps cards visible during requery and shows `Actualizando…`, preventing focus/order refresh flicker without presenting fake data.

### Save, detail, GPS, reverse geocoding

Audit found existing guards sufficient:

- Save: synchronous in-flight ref, disabled button, whole-draft validation, repository-only success, retry-preserved draft/photo.
- GPS: operation/native request refs prevent parallel work; failed refresh only commits after valid new coordinates.
- Reverse geocoding: failure maps to fallback label while coordinates stay valid.
- Detail: route ID normalization, focus/retry loading, request-version stale protection, not-found/error distinction, and back action already exist.

### User-facing errors

Camera mount and persistence failures now use concise Spanish messages instead of interpolating native exception text. Existing location, weather, list, detail, and save errors were already non-technical.

## Ownership boundaries

- `CameraCapture`: camera permission/capture.
- `useLocationCapture`: location permission/GPS/geocode orchestration.
- `WeatherService` and `useWeatherForLocation`: weather request/cache/stale ownership.
- Registration screen: validation and persistence.
- `useSightingsList`: list repository query/focus/order state.
- `useSightingDetail`: detail repository query/route state.

No mega-hook, global store, cancellation framework, or new native dependency was added.
