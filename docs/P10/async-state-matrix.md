# P10 Async-State Matrix

Audit performed before P10 code changes. Prior P5–P9 runtime claims remain pending unless explicitly reported by user.

| Flow | Idle | Loading | Success | Error / recovery | Duplicate protection | Stale-result protection | User-facing message | P10 finding |
|---|---|---|---|---|---|---|---|---|
| Camera permission/capture | `CameraCapture` starts with permission-loading/idle state | Permission request, camera readiness, capture and acceptance states are visible | Granted camera, preview, accepted persistent URI | Requestable denial retries; `canAskAgain === false` opens Settings; capture/persistence errors recover | `capturing` and `accepting` guards | Capture is guarded; permission state is not refreshed after returning from Settings | Spanish rationale and recovery text | **Gap:** Settings return can leave permission state stale. |
| Location permission/GPS | `useLocationCapture` starts idle | Permission request and acquisition text; 15s bounded wait | Valid coordinates plus reverse-geocode label/fallback | Requestable denial retries; permanent denial opens Settings; failed refresh leaves prior draft coordinates | Operation/native request refs prevent parallel acquisition | Prior valid draft survives failed refresh; unmounted native operation has no explicit lifecycle cancellation | Spanish purpose, failure, retry, Settings text | **Gap:** permission state is not refreshed after returning from Settings. |
| Reverse geocoding | Runs after valid coordinates | Included inside location acquisition state | Readable label stored | Failure falls back to `Ubicación obtenida`; coordinates remain valid and saveable | One geocode per successful acquisition | No stale label is committed without its coordinate callback | No technical geocoder error shown | **Correct:** non-blocking semantics already present. |
| Weather | Idle before coordinates | Loading state; service timeout 5s and one retry | Typed weather snapshot and cache | `Clima no disponible`; save continues | Hook reuses one in-flight request; service retries once | **Gap:** a new location while old request is pending can let old result overwrite current weather state. | Spanish loading/unavailable text | Fix request-token/key ownership. |
| Final save | Idle enabled action | Save label, synchronous ref guard, repository await | Success state and Alert after SQLite insert, then navigation | Repository error keeps draft/photo and permits retry; validation exposes required errors | `saveInFlightRef` plus disabled button | Current draft captured before weather/repository sequence; weather gap can affect snapshot | Generic Spanish repository error; no SQLite details | **Correct:** required validation and failure semantics already present. |
| List loading | Idle before focus | Repository query state | Rows or empty result | User-facing error plus retry | Same-order in-flight reuse | Request version invalidates blurred/superseded order results | Loading/error/retry Spanish text | **Minor gap:** clearing rows on every refresh causes avoidable list flicker. |
| Detail loading | Initial route state | Repository query state | Persisted detail content | Not-found differs from repository error; retry/back available | No parallel retry during one focus cycle | Request version invalidates old ID/focus results | Loading/error/not-found Spanish text | **Correct:** state separation and stale guard already present. |

## Permission configuration audit

- Camera rationale present in `app.json`.
- Foreground location rationale present in `app.json`.
- No gallery/media-library permission.
- No background location permission.
- No microphone permission/request configured for P5 camera flow.

## P10 changes selected

1. Refresh camera permission after app returns active from Settings.
2. Refresh foreground location permission after app returns active from Settings.
3. Add weather request generation/key guard so old-location weather cannot update newer location state.
4. Preserve list rows during refresh and expose updating context instead of clearing cards, reducing focus/order flicker.
5. Add focused deterministic tests for stale-weather token behavior and permission recovery helpers where practical.
