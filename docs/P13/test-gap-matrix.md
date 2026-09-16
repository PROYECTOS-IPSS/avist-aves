# P13 Test-Gap Matrix

Baseline audited: **14 suites / 101 tests**. Existing tests were read before adding cases.

| Requirement / risk | Existing test evidence | Gap | Priority | P13 action |
|---|---|---|---|---|
| RF-01 registration validation | `validateSightingDraft.test.ts` covers initialization, blank/name acceptance, quantity boundaries, date/time rejection, photo/GPS requirements, coordinate boundaries. `createSightingInput.test.ts` covers normalization, weather-null mapping, missing prerequisites. | No material RF-01 gap found. Camera hardware remains device-only. | N/A | No duplicate tests. |
| RF-02 weather parsing | `weatherService.test.ts` covers valid/malformed payload, network retry, timeout, cache hit/expiry, failure non-cache, field minimization. `weatherCode.test.ts` covers known/unknown codes. | HTTP 429/5xx retry classification and malformed-success no-retry behavior are not directly asserted. | P1 | Add bounded status/retry-classification tests. |
| RF-03 list ordering | `sightingMapper.test.ts` covers default/name/quantity clauses and whitelist. `sightingsList.test.ts` covers user labels. | Repository boundary and stale-order hook behavior are not directly deterministic without deeper hook/native mocking. | P2 / N/A | Keep mapper proof; document hook/runtime gap. |
| RF-04 detail | `routeParams.test.ts`, `formatSighting.test.ts`, and mapper tests cover route normalization, formatting, and mapped data. | `useSightingDetail` not-found vs repository-error transitions are coupled to Expo Router focus/native repository. | P2 / N/A | Keep pure helper coverage; document manual/runtime gap. |
| RF-05 persistence mapper | `sightingMapper.test.ts` covers complete and nullable rows; repository tests cover invalid quantity/blank bird before SQLite. | Invalid/malformed rows are not tested; repository successful create/find boundaries are not exercised through injected provider. | P1 | Add malformed-row rejection and injected repository boundary tests. |
| RF-05 schema/migration | No migration tests. | SQLite schema execution and restart persistence are native/runtime concerns; SQL emulation would be misleading. | P2 / N/A | Leave for device smoke; document explicitly. |
| RF-05 photo persistence | `photoPath.test.ts` covers safe extensions, owned filenames, and ownership rejection. | Native `expo-file-system` copy/delete behavior is not deterministic in Jest. | P2 / N/A | Keep path proof; document native/manual gap. |
| RF-06 navigation | `routeParams.test.ts` covers route input normalization. | Full-router mocks would assert implementation detail; navigation feel remains device-only. | N/A | No brittle router tests. |
| GPS/geocode | `locationHelpers.test.ts` covers finite/range boundaries, duplicate address components, and fallbacks. `permissionState.test.ts` covers permission classification. | Native permission/GPS and hook stale/duplicate operation behavior require runtime seams. | P2 / N/A | Keep pure helper proof; document manual gap. |
| Final save mapping | `createSightingInput.test.ts` covers valid weather, nullable weather, normalized name/notes, location, URI, quantity, and prerequisite rejection. | No material mapping gap found. | N/A | No duplicate tests. |
| Async/concurrency | `useWeatherForLocation.test.ts` covers version predicate; weather service covers request/cache ownership. | List/detail stale-result and duplicate save/camera/GPS guards have no clean pure seam. | P1 / N/A | Avoid invasive production refactor; document runtime-only guards. |
| Formatters | `formatSighting.test.ts`, `weatherCode.test.ts`, `locationHelpers.test.ts` cover readable and fallback values. | No material gap found. | N/A | No duplicate tests. |
| Error semantics | Existing weather/list/detail production code has explicit states; weather failure mapping is tested indirectly through service/input tests. | Repository not-found vs repository-error and hook state transitions are runtime-coupled. | P2 / N/A | Document manual/runtime evidence boundary. |

## P13 selection

Add only:

1. Weather HTTP retry classification and malformed-success retry boundary.
2. Mapper rejection of malformed required/quantity fields.
3. Injected repository create/find boundary behavior, including parameterized IDs and nullable fields.

Do not add UI snapshots, native hardware mocks, fake SQL engines, full-router mocks, arbitrary coverage thresholds, or duplicate validation cases.
