# P14 — EAS Preview APK

- **Previous:** P13 — Tests
- **Current:** P14 — EAS Preview APK
- **Next:** P15 — Final Release Gate

## Skill used

- **Context7:** verified EAS CLI local-build flags, APK `buildType`, internal distribution, SDK 57 `android.blockedPermissions`, and Expo camera/location permission behavior.

## Configuration audit

- Identity verified: `AvistAves`, `avistaves`, `com.wuanpack.avistaves`.
- EAS project ID verified: `29a6850f-2d28-4e7e-8e02-034f473dd19f`.
- App version remains `1.0.0`; no artificial versionCode bump.
- Preview profile is internal distribution and Android APK.
- Preview is standalone/bundled; `developmentClient` remains development-only.
- Existing EAS CLI 24.3.0 pin preserved.
- Existing `$HOME/eas-local-work` and `$HOME/eas-local-artifacts` mitigation preserved.
- Output remains `build-outputs/preview/avistaves-preview.apk`.
- Build outputs remain Git-ignored.
- Existing remote EAS credential strategy preserved; no secrets exposed.
- Unused `RECORD_AUDIO` permission blocked; camera and foreground location remain.

Full matrix: `build-readiness-audit.md`.

## P14 change

`app.json` now blocks `android.permission.RECORD_AUDIO`, which `expo-camera` contributes through package configuration even though AvistAves only captures still photographs. No native folder or prebuild was generated.

## Automated gates

- `yarn typecheck` — **PASS**
- `yarn lint` — **PASS**
- `yarn test` — **PASS**, 14 suites / 114 tests
- `npx expo-doctor` — **PASS**, 21/21 checks

Configuration audit and required gates passed. APK execution remains user-owned.


## Manual state

Configuration: **PASS** after final gates.

Manual Preview build: **PENDING USER**.

Physical Android smoke: **PENDING USER**.

Use:

```bash
yarn build:preview
```

Then follow `manual-build.md` and `android-smoke-checklist.md` against the Preview APK, not only the development client.

## Environment warning

Audit host currently reports Node 24.15.0 and Java 21.0.8. P2.1's validated baseline was Node 22 and Java 17. P14 does not modify system tooling; use the validated baseline where available and confirm disk before build.

## Native/build impact

No native dependency or configuration churn beyond the Android permission block. OMP did not build, install, prebuild, run Android, or validate web.

P15 is not started. Final release-gate evidence requires user-built APK, installation, and physical smoke results.

READY FOR MANUAL PREVIEW BUILD: YES
READY FOR P15: NO
