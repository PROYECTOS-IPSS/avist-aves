# P7 Validation

## Commands executed

| Check | Command | Result |
|---|---|---|
| TypeScript | `yarn typecheck` | **PASS** — no diagnostics. |
| Lint | `yarn lint` | **PASS** — ESLint completed cleanly. |
| Tests | `yarn test` | **PASS** — 9 suites, 78 tests passed. |
| Expo diagnostics | `npx expo-doctor` | **PASS** — 21/21 checks passed. |

## Automated coverage

- Weather code 0/cloud/fog/rain/snow/storm/unknown mapping: **PASS**
- Valid Open-Meteo response parsing: **PASS**
- Missing/invalid current weather fields: **PASS**
- One retry after transient failure: **PASS**
- Retry cap after two recoverable failures: **PASS**
- No retry for ordinary HTTP 4xx: **PASS**
- Abort timeout behavior: **PASS**
- Same coordinate bucket cache hit: **PASS**
- Expired cache refetch: **PASS**
- Weather-to-repository input mapping: **PASS**
- Nullable weather mapping: **PASS**
- Required photo/location mapping rejection: **PASS**
- Existing P2–P6 suites: **PASS**

No real Open-Meteo network request was made by OMP. No physical camera/GPS, Android reverse geocoding, or SQLite runtime flow was emulated in Jest.

## Manual Android/runtime status

**PENDING USER VALIDATION. Do not mark this checklist PASS until the user reports completion.** P5 camera and P6 GPS acceptance remain pending in their phase documentation. OMP did not run a build.

Required development-client flow:

```bash
yarn build:dev
yarn start
```

Install/update the generated development APK, start Metro, then:

- [ ] Open New Sighting.
- [ ] Complete bird name/date/time/quantity.
- [ ] Capture and accept a real photo.
- [ ] Obtain a real GPS location.
- [ ] Confirm readable location appears.
- [ ] Confirm weather enters loading state.
- [ ] Confirm successful weather shows temperature.
- [ ] Confirm successful weather shows readable condition.
- [ ] Confirm successful weather shows humidity or another third datum.
- [ ] Save the sighting.
- [ ] Confirm rapid repeated save taps do not create duplicate rows.
- [ ] Confirm success feedback.
- [ ] Confirm navigation returns to the list route after successful SQLite insert.
- [ ] Reopen registration and test network unavailable if practical.
- [ ] Confirm `Clima no disponible` or equivalent.
- [ ] Confirm the sighting still saves without weather.
- [ ] Confirm an intentionally reproducible repository/SQLite error does not navigate away or erase draft.
- [ ] Confirm no gallery or manual coordinate inputs exist.
- [ ] Confirm no P8 fake/list data implementation was introduced.

## Prohibited validation

- Real Open-Meteo network test: **NOT EXECUTED**.
- `yarn build:dev`: **NOT EXECUTED by OMP**.
- `yarn build:preview`: **NOT EXECUTED**.
- EAS/cloud build: **NOT EXECUTED**.
- `npx expo run:android`: **NOT EXECUTED**.
- `expo prebuild`: **NOT EXECUTED**.
- `expo start --web`: **NOT EXECUTED**.
- `expo export --platform web`: **NOT EXECUTED**.
- Browser/web validation: **NOT EXECUTED**.
