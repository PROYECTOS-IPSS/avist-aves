# P13 Test-Gap Closure

## Gaps closed

### P1 weather retry semantics — Strong

Added explicit 429, 500, and 503 retry/recovery cases. Added malformed-success no-retry case. Existing tests continue to cover timeout, network retry cap, 4xx no-retry, cache hit, expiry, failed-response non-cache, request minimization, and stale-version predicate.

### P1 persistence boundaries — Adequate

Added malformed mapper-row rejection and injected repository create/find/list cases. Tests verify data crossing the repository boundary without pretending to execute native SQLite. Existing input validation, complete/nullable mapping, and ordering whitelist tests remain green.

## RF confidence

| Requirement | Automated confidence | Manual dependency | Evidence |
|---|---|---|---|
| RF-01 Registration | **Strong** | Camera hardware and native capture | Validation, date/time, quantity, final input mapping tests |
| RF-02 Weather | **Strong** | Real network/connectivity | Parsing, code mapping, retry, timeout, cache, stale predicate tests |
| RF-03 List | **Adequate** | Focus refresh and visual list behavior | Mapper order whitelist, labels, repository list boundary |
| RF-04 Detail | **Adequate** | Router/focus transitions and image rendering | Route normalization, formatters, mapper, not-found helper boundary |
| RF-05 Persistence | **Adequate** | Native SQLite schema and process restart | Mapper, repository provider boundary, input validation, photo path tests |
| RF-06 Navigation | **Adequate** | Physical navigation feel and back behavior | Route normalization; no brittle router mocks |

## Gaps intentionally left manual/runtime-only

- Camera hardware, permission dialogs, temporary-to-durable file survival, and replacement deletion.
- Physical GPS, permission recovery, reverse-geocoder service behavior, timeout, and refresh races.
- SQLite migration execution, schema constraints on a real database, and persistence across process restart.
- Full `useSightingsList`/`useSightingDetail` focus lifecycle transitions and duplicate save/camera/GPS operations; their native/router coupling makes shallow mocks misleading.
- Real Open-Meteo service behavior and Android network conditions.
- Navigation usability, TalkBack, visual layout, outdoor readability, and keyboard behavior.

Jest cannot honestly prove these without a runtime harness or native device. No fake SQL engine or broad UI mock layer was introduced.
