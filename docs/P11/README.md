# P11 — API Optimization

- **Previous:** P10 — Permissions + Async/Error States
- **Current:** P11 — API Optimization
- **Next:** P12 — Accessibility + UI Polish

## Audited behavior

- Open-Meteo request uses only current weather variables consumed by AvistAves.
- Each attempt is bounded by a five-second AbortController timeout.
- Retry is capped at one additional attempt for network/timeout, HTTP 429, and HTTP 5xx failures.
- Ordinary 4xx responses and malformed successful payloads are not retried.
- Successful weather uses a three-decimal coordinate key and ten-minute in-memory TTL.
- Failed weather is not cached.
- Same-key active requests are reused by `useWeatherForLocation`.
- P10 request-version ownership rejects old-location results.
- Weather starts only after valid P6 coordinates.
- P8/P9 consume persisted historical weather and never call Open-Meteo.

## Actual P11 changes

- Added deterministic request-field minimization test.
- Added deterministic failure-not-cached test.
- Added `docs/P11/api-optimization-matrix.md` with code, benefit, failure, and evidence mapping.
- No production weather architecture redesign was necessary.
- No native dependency, native configuration, or schema change was added.

## Exclusions

No backend, proxy, rate limiter, gateway, distributed cache, telemetry platform, API SDK, P12 accessibility work, UI redesign, or release work.

## Quality gates

- `yarn typecheck`: **PASS**
- `yarn lint`: **PASS**
- `yarn test`: **PASS** — 14 suites, 101 tests
- `npx expo-doctor`: **PASS** — 21/21 checks
- Real network inspector evidence: **NOT EXECUTED**
- Physical Android validation: **PENDING USER CHECK**
- Web validation: **NOT EXECUTED**

## Native/build impact

P11 is JavaScript/TypeScript and test/documentation only. No development-client rebuild is required. OMP did not run Android builds, EAS builds, `expo prebuild`, or web validation.

READY FOR P12: YES