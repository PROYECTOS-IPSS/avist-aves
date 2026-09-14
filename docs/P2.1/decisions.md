# P2.1 Decisions

## D-P2.1-001 — Stable Android application ID

### Context

The project had no Android package identifier. Local EAS Android builds need a stable application identity for deterministic development and preview artifacts.

### Decision

Set `android.package` to `com.wuanpack.avistaves`.

### Reason

It is valid, project-specific, and will remain stable across development and preview builds.

### Alternatives considered

- Leave package unset: rejected; invites interactive/default identity changes.
- Use an institutional package: rejected; no official namespace was supplied.

### Impact

Future Android builds and installed development clients use this same package identity. Changing it later would create a separate Android application.

## D-P2.1-002 — Direct Metro development-client workflow

### Context

P2.1 replaces Expo Go as the documented Android runtime. Expo SDK 57 supports `expo start --dev-client`.

### Decision

Set `yarn start` to `expo start --dev-client`.

### Reason

It targets the installed custom development client and avoids relying on Expo Go during daily development.

### Alternatives considered

- Keep `expo start`: valid when `expo-dev-client` is installed, but less explicit.
- Use `expo start --go`: rejected; contradicts the target workflow.

### Impact

The user must install the development APK before daily Metro sessions.

## D-P2.1-003 — Explicit local output files

### Context

EAS CLI 24.3.0 supports `--local` and `--output <file>`. The requested output structure is directory-based.

### Decision

Scripts create directories with `mkdir -p` and pass deterministic APK file paths to `--output`:

- `build-outputs/development/avistaves-development.apk`
- `build-outputs/preview/avistaves-preview.apk`

### Reason

A file path is required by EAS CLI; explicit names avoid ambiguous artifact placement.

### Alternatives considered

- Pass a directory to `--output`: rejected; CLI expects output file path.
- Add external shell scripts: rejected; one package script per build is sufficient.

### Impact

Builds remain manual, local, and Linux-compatible. Output files are ignored by Git.

## D-P2.1-004 — Do not link an EAS remote project

### Context

EAS CLI can ask for `eas init` when displaying resolved project config. P2.1 explicitly forbids authentication and remote build activity.

### Decision

Keep local `eas.json` without `extra.eas.projectId` and do not run `eas init`.

### Reason

No remote project or credentials are required to review local configuration. User can link/configure EAS manually if the local build later requires it.

### Alternatives considered

- Run `eas init`: rejected; creates or links remote project state outside P2.1.
- Invent a project ID: rejected; would be invalid and misleading.

### Impact

Static configuration passes. Manual build may require the user to link an EAS project or provide the required local credentials/environment.
