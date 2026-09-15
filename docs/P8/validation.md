# P8 Validation

## Commands executed

| Check | Command | Result |
|---|---|---|
| TypeScript | `yarn typecheck` | **PASS** — no diagnostics. |
| Lint | `yarn lint` | **PASS** — ESLint completed cleanly. |
| Tests | `yarn test` | **PASS** — 11 suites, 87 tests passed. |
| Expo diagnostics | `npx expo-doctor` | **PASS** — 21/21 checks passed. |

## Automated coverage

- ISO date presentation: **PASS**
- Invalid date fallback: **PASS**
- Temperature formatting and unavailable state: **PASS**
- Typed date/name/quantity ordering mapping: **PASS**
- Existing P2–P7 suites: **PASS**

No native SQLite list runtime, device, camera, GPS, P7 save, or web validation was emulated in Jest.

## Manual Android/runtime status

**PENDING USER VALIDATION. Do not mark this checklist PASS until the user reports completion.** P5 camera, P6 GPS, and P7 full registration runtime checks also remain pending. OMP did not run a build.

With the current development client:

```bash
yarn start
```

If the installed client does not include P5/P6 native modules, use the existing documented rebuild flow before testing.

Checklist:

- [ ] Open Home with no rows if possible.
- [ ] Confirm designed empty state.
- [ ] Confirm registration CTA opens `/sightings/new`.
- [ ] Create and save one real sighting.
- [ ] Return to Home.
- [ ] Confirm newly persisted sighting appears without restarting the app.
- [ ] Confirm real photo thumbnail.
- [ ] Confirm bird name.
- [ ] Confirm readable observation date.
- [ ] Confirm stored temperature or `Clima no disponible`.
- [ ] Create/save at least two additional sightings with different names/quantities/times if practical.
- [ ] Select date ordering; confirm expected order.
- [ ] Select name ordering; confirm expected order.
- [ ] Select quantity ordering; confirm expected order.
- [ ] Confirm sort selection is visually clear.
- [ ] Confirm screen remains usable after leaving and returning.
- [ ] Reproduce repository load failure only if safe; otherwise leave error-state runtime check pending.
- [ ] Confirm no Open-Meteo request occurs merely by viewing the list.
- [ ] Confirm no fake sighting cards exist.

## Prohibited validation

- `yarn build:dev`: **NOT EXECUTED by OMP**.
- `yarn build:preview`: **NOT EXECUTED**.
- EAS/cloud build: **NOT EXECUTED**.
- `npx expo run:android`: **NOT EXECUTED**.
- `expo prebuild`: **NOT EXECUTED**.
- `expo start --web`: **NOT EXECUTED**.
- `expo export --platform web`: **NOT EXECUTED**.
- Browser/web validation: **NOT EXECUTED**.
