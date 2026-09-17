# P13 Implementation

## Audited and already correct

- `validateSightingDraft.test.ts` already covers draft initialization, free-text names, `No identificada`, blank names, quantity boundaries, impossible dates/times, photo/GPS prerequisites, and coordinate boundaries.
- `createSightingInput.test.ts` already covers trimming, observation timestamp normalization, quantity conversion, location/photo preservation, weather success, nullable weather, and required-state rejection.
- `weatherService.test.ts` already covered valid/malformed parsing, network retry cap, timeout, current-field minimization, cache hit/expiry, and failed-response non-caching.
- `weatherCode.test.ts` covers known and unknown code fallback.
- `locationHelpers.test.ts`, `permissionState.test.ts`, and `routeParams.test.ts` cover deterministic GPS/address/permission/route helpers.
- `formatSighting.test.ts` covers invalid date, nullable temperature, and quantity singular/plural.
- `photoPath.test.ts` covers safe extension fallback, app-owned filename shape, and ownership rejection.
- `sightingMapper.test.ts` already covers complete/nullable rows and the closed ordering whitelist.
- `SightingsRepository.test.ts` already covered invalid quantity and blank required input before SQLite access.
- No suitable deterministic seam existed for full native camera, GPS dialogs, SQLite restart persistence, router feel, or all hook focus/concurrency transitions.

## Changed in P13

### Weather retry classification

Added deterministic cases proving HTTP 429 and 5xx responses retry once and can recover, plus malformed successful payloads do not retry. Existing timeout, network retry cap, cache, and failure tests remain unchanged.

### Mapper failure boundaries

Added malformed-row cases for invalid row shape, required strings, required numbers, non-integer quantity, and invalid nullable fields. These prove invalid database data fails safely instead of becoming a domain object.

### Repository provider boundary

Used the repository's existing injected database provider, not a fake SQL engine, to verify:

- trimmed required values reach parameter arrays;
- nullable fields survive the create boundary;
- created rows are mapped back;
- `findById` returns `null` for missing data;
- list rows use the closed order clause and map correctly.

## Deliberate non-changes

No production code, native configuration, dependencies, Jest configuration, coverage threshold, snapshots, UI tests, router mocks, camera mocks, GPS mocks, real network calls, or database emulation were added.
