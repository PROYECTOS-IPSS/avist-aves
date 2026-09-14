# P5 Validation

## Commands executed

| Check | Command | Result |
|---|---|---|
| TypeScript | `yarn typecheck` | **PASS** — no diagnostics. |
| Lint | `yarn lint` | **PASS** — ESLint completed cleanly. |
| Tests | `yarn test` | **PASS** — 5 suites, 39 tests passed. |
| Expo diagnostics | `npx expo-doctor` | **PASS** — 21/21 checks passed. |

## Automated coverage

- Safe camera-extension normalization: **PASS**
- Collision-resistant app-owned filename shape: **PASS**
- Ownership boundary and traversal rejection: **PASS**
- Existing whole-draft missing-photo validation: **PASS**
- Existing whole-draft missing-GPS validation: **PASS**
- Existing P2–P4 suites: **PASS**

Physical camera hardware was not emulated in Jest.

## Manual Android status

**PENDING USER VALIDATION. Do not mark this checklist PASS until the user reports completion.** The existing development client predates P5 native camera changes. OMP did not run a build.

Required user flow after rebuilding the development client:

```bash
yarn build:dev
yarn start
```

Install/update generated development APK, then:

- [ ] Open New Sighting.
- [ ] Tap `Tomar foto`.
- [ ] Confirm camera rationale/prompt.
- [ ] Grant camera permission.
- [ ] Confirm live preview appears.
- [ ] Capture once.
- [ ] Confirm rapid double-tap does not create duplicate capture behavior.
- [ ] Confirm captured image preview.
- [ ] Accept/use the image.
- [ ] Confirm form marks the photo requirement satisfied.
- [ ] Retake the photo.
- [ ] Confirm previous draft photo is replaced correctly.
- [ ] Deny permission in a separate test if practical; confirm UI does not crash.
- [ ] Restart as practical; verify chosen draft URI is app-owned/persistent rather than only a transient camera cache URI.
- [ ] Confirm final save remains unavailable because GPS is still pending.

## Scope and prohibited validation

- Camera acquisition: implemented; physical Android validation pending.
- Gallery/media-library fallback: not implemented.
- GPS/location permission: not implemented.
- Reverse geocoding/weather: not implemented.
- SQLite insertion/final save: not implemented.
- Android build (`yarn build:dev`): **NOT EXECUTED by OMP**.
- Preview build/EAS build: **NOT EXECUTED**.
- `npx expo run:android`: **NOT EXECUTED**.
- `expo prebuild`: **NOT EXECUTED**.
- Web start/export/browser validation: **NOT EXECUTED**.
