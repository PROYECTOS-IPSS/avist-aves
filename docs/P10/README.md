# P10 — Permissions + Async/Error State Audit

- **Previous:** P9 — Sighting Detail
- **Current:** P10 — Permissions + Async/Error States
- **Next:** P11 — API Optimization

## Actual fixes

- Camera permission state refreshes after app returns active from Settings.
- Foreground location permission state refreshes after app returns active from Settings.
- Camera persistence, mount, and capture errors no longer expose native exception text.
- Weather requests use request-version ownership so an older location cannot overwrite newer-location weather state.
- List refresh preserves real rows during requery and communicates `Actualizando…` instead of clearing cards and flickering.
- Added deterministic permission-state and stale-weather ownership regression tests.

## Audited behavior left unchanged

- Camera permission remains point-of-use with rationale, retryable denial, permanent-denial Settings action, capture/accept busy guards, and no gallery/microphone flow.
- GPS remains foreground-only, point-of-use, one-shot, balanced-accuracy, bounded, retryable, and duplicate guarded.
- Reverse-geocode failure preserves coordinates and uses readable fallback.
- Weather keeps five-second timeout, one retry, successful coordinate-bucket cache, and non-blocking save semantics.
- Save validates photo/GPS/editable fields, guards duplicate submits, preserves draft/photo on repository failure, and navigates only after SQLite success.
- List and detail keep typed repository ordering, request-version guards, retry, focus refresh, not-found separation, and back navigation.

## Explicit exclusions

No product redesign, global state, cancellation framework, permission consolidation, background location, weather/API redesign, edit/delete, list/detail feature expansion, release work, backend, authentication, synchronization, or P11 API optimization.

## Quality gates

- `yarn typecheck`: **PASS**
- `yarn lint`: **PASS**
- `yarn test`: **PASS** — 14 suites, 99 tests
- `npx expo-doctor`: **PASS** — 21/21 checks
- Physical Android cases: **PENDING USER CHECK**
- Web validation: **NOT EXECUTED**

## Native/build impact

P10 changes are JavaScript/TypeScript only. No native dependency or permission configuration changed. `yarn start` is sufficient once existing P5/P6 native modules are present in installed development client.

OMP did not run Android builds, EAS builds, `expo prebuild`, or web validation.

READY FOR P11: YES