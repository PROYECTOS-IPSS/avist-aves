# P6 Validation

## Commands executed

| Check | Command | Result |
|---|---|---|
| TypeScript | `yarn typecheck` | **PASS** — no diagnostics. |
| Lint | `yarn lint` | **PASS** — ESLint completed cleanly. |
| Tests | `yarn test` | **PASS** — 6 suites, 53 tests passed. |
| Expo diagnostics | `npx expo-doctor` | **PASS** — 21/21 checks passed. |

## Automated coverage

- Latitude/longitude normal values: **PASS**
- Latitude `-90` and `90`: **PASS**
- Longitude `-180` and `180`: **PASS**
- Out-of-range and non-finite coordinates: **PASS**
- Full reverse-geocode label: **PASS**
- Missing address fields: **PASS**
- Duplicate address components: **PASS**
- Empty reverse-geocode result fallback: **PASS**
- Photo plus valid coordinates clears whole-draft photo/location errors: **PASS**
- Existing P2–P5 suites: **PASS**

Physical GPS hardware and Android reverse-geocoding services were not emulated in Jest.

## Manual Android status

**PENDING USER VALIDATION. Do not mark this checklist PASS until the user reports completion.** The P5 camera checklist also remains pending. OMP did not run a build.

Required user flow after rebuilding the development client:

```bash
yarn build:dev
yarn start
```

Install/update generated development APK, then:

- [ ] Open New Sighting.
- [ ] Tap `Obtener ubicación`.
- [ ] Confirm Spanish location rationale/system prompt.
- [ ] Grant foreground location permission.
- [ ] Confirm loading state is visible.
- [ ] Confirm a real location is obtained.
- [ ] Confirm UI shows a human-readable place name.
- [ ] Confirm coordinates, if shown, are secondary and reasonably rounded.
- [ ] Confirm location requirement becomes satisfied.
- [ ] Tap `Actualizar ubicación` and verify previous valid location is not lost if refresh fails.
- [ ] Deny permission in a separate test if practical; confirm UI does not crash.
- [ ] Confirm no manual coordinate input exists.
- [ ] Confirm photo state remains intact after obtaining location.
- [ ] Confirm bird/date/time/quantity/notes remain intact.
- [ ] Confirm no weather information is fabricated yet.
- [ ] Confirm no SQLite save or success navigation occurs yet.

## Scope and prohibited validation

- Foreground GPS acquisition: implemented; physical Android validation pending.
- Reverse geocoding: implemented; physical Android validation pending.
- Background location/watchers/geofencing: not implemented.
- Weather/Open-Meteo: not implemented.
- SQLite insertion/final save: not implemented.
- Android build (`yarn build:dev`): **NOT EXECUTED by OMP**.
- Preview build/EAS build: **NOT EXECUTED**.
- `npx expo run:android`: **NOT EXECUTED**.
- `expo prebuild`: **NOT EXECUTED**.
- Web start/export/browser validation: **NOT EXECUTED**.
