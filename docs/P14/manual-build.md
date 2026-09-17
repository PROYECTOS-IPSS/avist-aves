# P14 Manual Preview APK Build

P14 configuration audit is complete. OMP did **not** build or install the APK.

## Preflight

Run from project root:

```bash
node --version
java -version
adb --version
df -h "$HOME"
df -h /tmp
git status --short
```

Preferred validated tool baseline: Node 22, Java 17, Yarn Classic. Use storage outside constrained `/tmp`; this project preserves `$HOME/eas-local-work` and `$HOME/eas-local-artifacts` for EAS local work.

Confirm EAS authentication/credential access if the CLI requests it. Do not print or commit credential material.

## Build command

Run manually:

```bash
yarn build:preview
```

This invokes the existing script, which creates the output directories, keeps EAS work outside `/tmp`, uses EAS CLI 24.3.0, selects the `preview` profile, performs a local Android build, and writes an APK.

## Artifact verification

After a successful build:

```bash
ls -lh build-outputs/preview/avistaves-preview.apk
sha256sum build-outputs/preview/avistaves-preview.apk
```

Expected artifact:

```text
build-outputs/preview/avistaves-preview.apk
```

## Install manually

If ADB is available and the device is authorized:

```bash
adb install -r build-outputs/preview/avistaves-preview.apk
```

If installation fails because an incompatible signing key or version is already installed, uninstall the existing app only after preserving any data that matters. Then install the Preview APK again.

Do not upload this artifact to Play Console as part of P14.

## Evidence to return

After manual execution, report:

- build command result;
- APK path;
- APK size;
- optional SHA-256;
- installation result;
- app launch result;
- any credential, disk, Gradle, or signing error.

Then execute `docs/P14/android-smoke-checklist.md` against this Preview APK, not only the development client.
