# P14 Implementation

## Audited and already correct

- `app.json` identity is coherent: name `AvistAves`, slug `avistaves`, Android package `com.wuanpack.avistaves`.
- EAS project ID remains `29a6850f-2d28-4e7e-8e02-034f473dd19f`.
- App version remains `1.0.0`; no artificial `android.versionCode` bump was introduced.
- `eas.json` keeps CLI minimum `>= 24.3.0`, development-client APK profile, and standalone internal Preview APK profile.
- `package.json` keeps the pinned `npx -y eas-cli@24.3.0` invocation and the existing local-build storage mitigation.
- Preview output remains `build-outputs/preview/avistaves-preview.apk`.
- `build-outputs/`, `*.apk`, and `*.aab` remain ignored.
- `babel.config.js`, `metro.config.js`, and `yarn.lock` require no P14 change.
- P2.1 credential strategy remains remote EAS Android credentials with local compilation; no credential file or secret is tracked.
- No production/store submission profile exists or was added.

## Changed in P14

### Unused microphone permission blocked

Resolved public Expo config showed CAMERA, RECORD_AUDIO, and foreground location permissions. AvistAves captures still photographs and does not record audio. Added:

```json
"blockedPermissions": ["android.permission.RECORD_AUDIO"]
```

under `expo.android`. Camera and foreground coarse/fine location remain. This uses SDK 57's documented `android.blockedPermissions` mechanism to remove a permission introduced by a package manifest; it does not require `expo prebuild` during this audit.

## Final build values

| Value | Final state |
|---|---|
| Name | `AvistAves` |
| Slug | `avistaves` |
| Android package | `com.wuanpack.avistaves` |
| App version | `1.0.0` |
| Android versionCode | Not explicitly set; no P14 bump introduced |
| EAS project ID | `29a6850f-2d28-4e7e-8e02-034f473dd19f` |
| Preview distribution | `internal` |
| Preview Android output | `apk` |
| Artifact path | `build-outputs/preview/avistaves-preview.apk` |
| EAS invocation | `npx -y eas-cli@24.3.0 build --platform android --profile preview --local --output ...` |
| Local scratch | `$HOME/eas-local-work` |
| Local artifacts scratch | `$HOME/eas-local-artifacts` |
| Credentials | Existing remote EAS Android credentials; no secrets documented |

## Environment note

Inspection found Node `v24.15.0` and Java `21.0.8`, while P2.1's validated baseline was Node 22 and Java 17. P14 does not modify host tooling. Manual build operator should use the previously validated Node/Java baseline where available and confirm free disk outside `/tmp` before execution.
