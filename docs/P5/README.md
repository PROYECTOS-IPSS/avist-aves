# P5 — Camera + Persistent Image

- **Previous:** P4 — Registration Form + Validation
- **Current:** P5 — Camera + Persistent Image
- **Next:** P6 — GPS + Reverse Geocoding

## Implemented scope

- Point-of-use camera permission flow with Spanish rationale, denial handling, retry, and Android settings guidance when permission is permanently blocked.
- In-app `CameraView` capture only; no gallery or media-library picker.
- Capture guard, visible progress/error states, preview, accept, and retake behavior.
- Durable copy from camera cache URI into app document storage.
- Safe replacement cleanup for old app-owned draft photos.
- Persistent URI integration with the existing `SightingDraft.photoUri` field.
- Photo-ready UI while GPS remains visibly pending.
- Pure deterministic tests for extension, filename, and ownership rules.

## Explicit exclusions

GPS, location permission, reverse geocoding, weather, repository insertion, final save, list/detail integration, backend, authentication, synchronization, and aggressive abandoned-draft cleanup remain deferred.

## Quality gates

- `yarn typecheck`: **PASS**
- `yarn lint`: **PASS**
- `yarn test`: **PASS** — 5 suites, 39 tests
- `npx expo-doctor`: **PASS** — 21/21 checks
- Web validation: **NOT EXECUTED**
- Android physical-camera validation: **PENDING USER CHECK**

## Native and development-client status

Added SDK 57-compatible `expo-camera` and `expo-file-system` dependencies. Added the `expo-camera` config plugin with the required Spanish camera rationale and no microphone permission. A development-client rebuild is required before physical camera validation because camera is native functionality.

OMP did not run an Android build, web validation, `expo prebuild`, or an EAS build. Manual flow:

```bash
yarn build:dev
yarn start
```

Install/update generated development APK, then follow `docs/P5/validation.md`.

## P4 status

P4 documentation remains truthful: manual Android validation is pending for the P4 form because the existing APK predates those changes. P5 automated gates pass and P5 physical camera validation still requires the rebuilt development client.

READY FOR P6: YES