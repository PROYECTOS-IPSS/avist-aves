# P9 Validation

## Commands executed

| Check | Command | Result |
|---|---|---|
| TypeScript | `yarn typecheck` | **PASS** — no diagnostics. |
| Lint | `yarn lint` | **PASS** — ESLint completed cleanly. |
| Tests | `yarn test` | **PASS** — 12 suites, 97 tests passed. |
| Expo diagnostics | `npx expo-doctor` | **PASS** — 21/21 checks passed. |

## Automated coverage

- String route ID normalization: **PASS**
- Array route ID normalization: **PASS**
- Missing/empty/oversized route IDs: **PASS**
- Human-readable date reuse: **PASS**
- Invalid date fallback: **PASS**
- Quantity singular/plural formatting: **PASS**
- Temperature unavailable fallback: **PASS**
- Existing P2–P8 suites: **PASS**

No native SQLite detail runtime, physical device, camera, GPS, P7 save, or web validation was emulated in Jest.

## Manual Android/runtime status

**PENDING USER VALIDATION. Do not mark this checklist PASS until the user reports completion.** Prior P5–P8 manual validation remains pending in its phase documentation. OMP did not run a build.

With the current development client:

```bash
yarn start
```

Checklist:

- [ ] Ensure at least one real persisted sighting exists.
- [ ] Open Home.
- [ ] Tap a real sighting card.
- [ ] Confirm navigation to `/sightings/<real-id>`.
- [ ] Confirm large real photo is displayed.
- [ ] Confirm bird name.
- [ ] Confirm readable observation date/time.
- [ ] Confirm quantity.
- [ ] Confirm human-readable location is primary.
- [ ] Confirm coordinates, if shown, are secondary.
- [ ] Confirm stored temperature.
- [ ] Confirm stored readable weather condition.
- [ ] Confirm stored humidity.
- [ ] Confirm notes appear only when present.
- [ ] Confirm no Open-Meteo request occurs when opening detail.
- [ ] Confirm back returns to Home.
- [ ] Reopen same detail and confirm consistent data.
- [ ] Test malformed/nonexistent ID if practical; confirm designed not-found state.
- [ ] Reproduce repository failure only if safe; otherwise leave error/retry check pending.
- [ ] Confirm no edit/delete controls exist.

## Prohibited validation

- `yarn build:dev`: **NOT EXECUTED by OMP**.
- `yarn build:preview`: **NOT EXECUTED**.
- EAS/cloud build: **NOT EXECUTED**.
- `npx expo run:android`: **NOT EXECUTED**.
- `expo prebuild`: **NOT EXECUTED**.
- `expo start --web`: **NOT EXECUTED**.
- `expo export --platform web`: **NOT EXECUTED**.
- Browser/web validation: **NOT EXECUTED**.
