# P2.1 Implementation

## Development client

Installed with the Expo-recommended command:

```bash
npx expo install expo-dev-client
```

Resolved version: `~57.0.19`. `expo-dev-client` is included in `app.json` plugins. The Android development workflow no longer targets Expo Go; `start` uses `expo start --dev-client`.

## Android identity

`app.json` now defines:

```json
{
  "android": {
    "package": "com.wuanpack.avistaves"
  }
}
```

This stable application ID is required for deterministic Android development/preview artifacts. No credentials or signing configuration was added.

## EAS configuration

`eas.json` uses EAS CLI `24.3.0` or newer:

- `development`: `developmentClient: true`, `distribution: internal`, Android APK.
- `preview`: `distribution: internal`, Android APK.
- No production profile was added.

The repository remains managed workflow. No `android/` directory or `eas init` project link was generated.

## Package scripts

```json
{
  "start": "expo start --dev-client",
  "build:dev": "mkdir -p build-outputs/development && npx eas-cli build --platform android --profile development --local --output build-outputs/development/avistaves-development.apk",
  "build:preview": "mkdir -p build-outputs/preview && npx eas-cli build --platform android --profile preview --local --output build-outputs/preview/avistaves-preview.apk"
}
```

Each build script creates its output directory before invoking EAS. `--output` receives a file path, matching EAS CLI 24.3.0 help. Commands are Linux-compatible and intended for manual execution with Yarn or npm script forwarding.

Expected manual outputs:

```text
build-outputs/development/avistaves-development.apk
build-outputs/preview/avistaves-preview.apk
```

## Git hygiene

`.gitignore` now excludes:

- `build-outputs/`
- `*.apk`
- `*.aab`

`eas.json`, source, and documentation remain trackable.

## Manual workflow

First development build:

```bash
yarn build:dev
```

Install resulting APK manually on Android emulator/device. Daily development:

```bash
yarn start
```

Then open installed development client. Preview validation:

```bash
yarn build:preview
```

Preview APK is standalone and does not depend on Metro or Expo Go.

## Explicit non-actions

No build was executed during P2.1. No `eas build`, `eas build --local`, `yarn build:dev`, `yarn build:preview`, `npx expo run:android`, Gradle build, prebuild, browser launch, or Web validation was performed.
