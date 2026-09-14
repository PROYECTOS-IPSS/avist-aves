# P2.1 — Local Android Development/Preview Build Infrastructure

- **Previous phase:** P2
- **Current phase:** P2.1
- **Next phase:** P3

## Objective

Configure and validate Android development/preview infrastructure without advancing into product functionality.

## Final outcome

P2.1 infrastructure was configured and manually validated on Android:

- Development-build infrastructure configured successfully.
- EAS project linked to account `wuanpack` because local EAS builds required project identity and credentials.
- Android package: `com.wuanpack.avistaves`.
- EAS local compilation used remote Android credentials while compilation ran locally.
- `expo-doctor`: **21/21 checks passed** after dependency cleanup/alignment.
- Package manager: Yarn Classic `1.22.22`.
- Mixed-lockfile and local EAS CLI issues were corrected.
- Verified local baseline: Node 22 and Java 17.
- Initial local build attempt failed under `/tmp`, a constrained Fedora tmpfs. Root cause: `No space left on device` during Kotlin/CMake/D8/Gradle output.
- Successful local build completed using adequate non-constrained storage.
- Development APK generated successfully.
- Development APK opened successfully on a physical Android phone.
- `yarn start` started Metro in development-client mode.
- Installed AvistAves development client opened successfully on the phone.
- React Native DevTools showed a Chromium SUID sandbox error under Flatpak VSCodium; Metro and app operation were unaffected.
- Web validation was not required and was not used.

## Configuration

- `expo-dev-client`: `~57.0.19`
- EAS development profile: development client, internal distribution, APK
- EAS preview profile: internal distribution, APK
- Android package: `com.wuanpack.avistaves`
- `yarn start`: `expo start --dev-client`
- Development output: `build-outputs/development/avistaves-development.apk`
- Preview output: `build-outputs/preview/avistaves-preview.apk`
- `build-outputs/`, `*.apk`, and `*.aab` remain ignored by Git.

## Quality gates

- `yarn typecheck`: **PASS**
- `yarn lint`: **PASS**
- `yarn test`: **PASS**
- `npx expo-doctor`: **PASS** — 21/21 checks
- Manual development build: **PASS**
- Physical Android installation/open: **PASS**
- Web validation: intentionally skipped

## Historical execution policy

The original P2.1 configuration pass did not execute a build. Manual validation was completed afterward by the user. This closure records that outcome; no additional Android build is executed for documentation closure.

**READY FOR P3: YES**
