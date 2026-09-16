# P14 Build Readiness Audit

Audit performed without running an Android build, prebuild, Gradle, or APK installation.

| Area | Current state | Expected state | Issue | P14 action |
|---|---|---|---|---|
| App identity | Name `AvistAves`; slug `avistaves`; package `com.wuanpack.avistaves`. | Stable expected identity. | None. | Keep unchanged. |
| EAS project | `extra.eas.projectId` is `29a6850f-2d28-4e7e-8e02-034f473dd19f`. | Existing linked project. | None. | Keep unchanged. |
| Version | App version `1.0.0`; no explicit `android.versionCode` in `app.json`. | No artificial P14 bump. | Version code remains EAS/platform-managed for current workflow. | Document; do not invent a bump. |
| EAS CLI | Script pins `npx -y eas-cli@24.3.0`; `eas.json` requires `>= 24.3.0`. | Coherent pinned/manual CLI policy. | None. | Keep unchanged. |
| Development profile | `developmentClient: true`, internal APK. | Metro/dev-client workflow. | None. | Keep unchanged. |
| Preview profile | `distribution: internal`; Android `buildType: apk`; no `developmentClient`. | Standalone installable APK with bundled JS. | None. | Keep unchanged. |
| Preview output | Script creates `build-outputs/preview` and writes `avistaves-preview.apk`. | Deterministic ignored artifact path. | None. | Keep unchanged. |
| Local EAS scratch | Script exports `$HOME/eas-local-work` and `$HOME/eas-local-artifacts`. | Avoid constrained `/tmp`. | None. | Preserve exactly. |
| Git ignore | `build-outputs/`, `*.apk`, and `*.aab` ignored. | APK/AAB cannot be committed accidentally. | None. | Keep unchanged. |
| Permissions before P14 | Resolved config included CAMERA, RECORD_AUDIO, ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION. | Camera and foreground location only; no microphone. | `expo-camera` package manifest adds audio permission by default. | Add `android.blockedPermissions` for `RECORD_AUDIO`. |
| Permissions after P14 | Camera + foreground coarse/fine location remain; RECORD_AUDIO is blocked in app config. | Functional permissions only. | Final manifest requires build-time confirmation; no prebuild run. | Verify resolved config; document package-vs-app behavior. |
| Config plugins | `expo-camera` and `expo-location` have app-specific rationales; no gallery/media plugin. | Clear permission intent. | None after microphone block. | Keep unchanged. |
| Credentials | P2.1 documents remote EAS Android credentials with local compilation; no credentials files in repo. | Local build compatible with managed/remote credentials. | Interactive EAS authentication may be required. | Document without exposing secrets. |
| Package/tool compatibility | Expo packages remain SDK 57 aligned; P13 baseline doctor was green. | No dependency churn. | None identified. | Run final gates and doctor. |
| Host environment | Current inspection: Node `v24.15.0`, Java `21.0.8`, ADB `1.0.41`; `/home` has 34G free, `/tmp` has 12G free. | Previously validated baseline Node 22 / Java 17 and adequate non-`/tmp` storage. | Current host versions differ from historical validated baseline; home filesystem is 93% used. | Do not modify host; manual build should use Node 22/Java 17 where available and confirm disk before starting. |
| Build execution | No APK/build command run by OMP. | User runs build manually after handoff. | Artifact does not exist yet. | Keep build pending. |

## P14 decision

Configuration is ready for manual Preview APK execution after the user confirms documented local prerequisites. No production/store profile, package rename, credential regeneration, SDK upgrade, or native dependency change is required.
