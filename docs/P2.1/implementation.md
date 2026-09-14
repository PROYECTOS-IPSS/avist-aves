# P2.1 Implementation and Closure

## Development client and package identity

Installed `expo-dev-client` for Expo SDK 57. The project uses Android package `com.wuanpack.avistaves`.

`yarn start` targets the custom client through `expo start --dev-client`; Expo Go is not part of the documented Android workflow.

## EAS profiles and local builds

`eas.json` defines:

- `development`: `developmentClient: true`, `distribution: internal`, Android APK.
- `preview`: `distribution: internal`, Android APK.

Scripts create deterministic output paths:

```json
{
  "build:dev": "mkdir -p build-outputs/development && npx eas-cli build --platform android --profile development --local --output build-outputs/development/avistaves-development.apk",
  "build:preview": "mkdir -p build-outputs/preview && npx eas-cli build --platform android --profile preview --local --output build-outputs/preview/avistaves-preview.apk"
}
```

The EAS project is now linked to account `wuanpack`. Local compilation uses local build tooling and remote Android credentials. No production profile, Play Store upload, or release signing workflow was added.

## Dependency and environment cleanup

- Yarn Classic `1.22.22` is package-manager baseline.
- Mixed-lockfile issues were corrected.
- Local EAS CLI issues were corrected.
- Node 22 and Java 17 were used where verified.
- `expo-doctor` completed 21/21 checks after dependency alignment.

## Build troubleshooting evidence

An initial local build ran under `/tmp` and failed with `No space left on device` during Kotlin/CMake/D8/Gradle output. This was a constrained Fedora tmpfs storage failure, not an application or EAS profile failure.

A later local build used adequate non-constrained storage and completed successfully. The development APK was generated and opened on a physical Android phone. `yarn start` then started Metro in development-client mode and the installed AvistAves development client opened successfully.

React Native DevTools displayed a Chromium SUID sandbox error under Flatpak VSCodium. Metro and application operation were unaffected.

## Git hygiene

`build-outputs/`, `*.apk`, and `*.aab` remain ignored. No generated build output is part of source documentation. No Web configuration or Web validation was added for P2.1.

## Manual workflow now available

```bash
yarn build:dev
yarn start
yarn build:preview
```

The user owns future build execution and artifact inspection. P2.1 closure did not execute another build.
