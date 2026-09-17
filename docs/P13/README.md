# P13 — Tests

- **Previous:** P12 — Accessibility + UI Polish
- **Current:** P13 — Tests
- **Next:** P14 — EAS Preview APK

## Skills used

- **ponytail-review:** final review for duplicate cases, brittle mocks, implementation-detail coupling, and unnecessary test complexity.
- **Context7:** not invoked. Existing Jest/jest-expo seams, injected repository provider, and current project patterns answered the testing questions without requiring current API behavior lookup.

## Baseline

- 14 test suites
- 101 tests
- TypeScript, lint, tests, and Expo Doctor were green after P12.

## Audit findings

- **P1:** weather tests did not directly prove 429/5xx retry classification or malformed-success no-retry behavior.
- **P1:** mapper tests did not exercise malformed required/nullable fields; repository tests did not exercise successful injected create/find/list boundaries.
- **P2/N/A:** native SQLite migration/restart, camera/file-system durability, physical GPS/permissions, full hook concurrency transitions, and router feel are not honest Jest targets without deeper fakes.
- **No P0 gaps:** registration validation, final-save mapping, coordinate/address helpers, route normalization, photo ownership, weather cache/retry cap, and formatter fallbacks already had meaningful deterministic evidence.

Matrix: `test-gap-matrix.md`.

## Tests added

- Four weather request-policy cases: HTTP 429/500/503 retry once and malformed successful response does not retry.
- Six malformed-row mapper cases: invalid object, required strings/numbers, quantity, and nullable field.
- Three injected repository boundary cases: parameterized normalized create, missing ID, and list ordering/mapping.

Result: **14 suites / 114 tests**. No production behavior changed.

## Confidence

- RF-01: **Strong** for validation and final input mapping; camera capture remains manual/device-dependent.
- RF-02: **Strong** for deterministic parsing, mapping, retries, cache behavior, and stale-version predicate; real network remains manual.
- RF-03: **Adequate** for ordering whitelist/labels and repository list boundary; hook refresh/stale behavior remains runtime-dependent.
- RF-04: **Adequate** for route normalization, formatting, and mapping; detail loading/not-found runtime transitions remain manual-dependent.
- RF-05: **Adequate** for input validation, mapper, repository boundary, and photo path ownership; native schema/restart durability remains manual.
- RF-06: **Adequate** for route input normalization; navigation feel remains manual.

Detailed closure: `test-gap-closure.md`.

## Deliberately not added

No UI snapshots, NativeWind snapshots, router call mocks, fake SQL engine, camera/GPS mocks, real network calls, coverage threshold, dependency, native configuration, or P14 APK work.

## Quality gates

- `yarn typecheck` — PASS
- `yarn lint` — PASS
- `yarn test` — PASS — 14 suites, 114 tests
- `npx expo-doctor` — PASS — 21/21 checks
- Coverage report — NOT RUN; no useful project need identified beyond critical-module tests.

## Manual/device gaps

See `validation.md`. Real camera, permission dialogs, physical GPS, network weather behavior, SQLite persistence across restart, navigation feel, TalkBack, and visual layout remain device validation.

## Native/build impact

P13 changed Jest/TypeScript test files and documentation only. No native dependency or configuration change was introduced.

Development-client rebuild required: NO

P14+ build command is intentionally not run in P13.

READY FOR P14: YES
