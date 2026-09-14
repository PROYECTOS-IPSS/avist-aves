# P2.1 Decisions

## D-P2.1-001 — Stable Android application ID

### Context

The project had no Android package identifier. Local EAS Android builds need stable application identity.

### Decision

Set `android.package` to `com.wuanpack.avistaves`.

### Reason

Valid project-specific identifier suitable for development and preview builds.

### Alternatives considered

- Leave package unset: rejected; invites identity changes.
- Use an institutional package: rejected; no official namespace was supplied.

### Impact

Future Android builds and installed clients use the same package identity.

## D-P2.1-002 — Development-client Metro workflow

### Context

Android evaluation uses a custom development client rather than Expo Go.

### Decision

Set `yarn start` to `expo start --dev-client`.

### Reason

Targets the installed development APK directly.

### Impact

The development APK must be installed before daily Metro work.

## D-P2.1-003 — Explicit local output files

### Context

EAS CLI 24.3.0 supports `--local` and `--output <file>`.

### Decision

Use deterministic output files:

- `build-outputs/development/avistaves-development.apk`
- `build-outputs/preview/avistaves-preview.apk`

### Impact

Build artifacts remain easy to identify and ignored by Git.

## D-P2.1-004 — Do not link an EAS remote project (superseded)

### Context

The original P2.1 configuration pass did not have an EAS project link and avoided authentication.

### Decision

**Superseded.** The later manual local-build workflow linked the EAS project to account `wuanpack` because local EAS builds required project identity and credentials.

### Reason for supersession

Manual build execution demonstrated that project identity and Android credentials were required for the real local-build workflow.

### Impact

Current project state is linked to `wuanpack`. This supersedes only the no-link assumption; it does not add production or remote build behavior.

## D-P2.1-005 — Remote Android credentials with local compilation

### Context

Manual validation showed EAS local builds use remote Android credentials while compilation occurs locally.

### Decision

Retain EAS credential/project linkage for manual local builds. Do not duplicate signing material in the repository.

### Reason

Matches successful validated workflow and avoids secrets in Git.

### Impact

Manual users need valid EAS identity/credential access when rebuilding.

## D-P2.1-006 — Storage requirement for local builds

### Context

A build under `/tmp` failed with `No space left on device` during Kotlin/CMake/D8/Gradle output.

### Decision

Run future local builds from adequate non-constrained storage, not Fedora tmpfs `/tmp`.

### Reason

Failure was storage/environmental, not source or profile configuration.

### Impact

Manual build instructions must include sufficient disk space and a suitable local Android/JDK environment.

## D-P2.1-007 — Yarn/Node/Java baseline

### Context

Successful manual validation used Yarn Classic `1.22.22`, Node 22, and Java 17 where verified.

### Decision

Keep these as local development baseline and document dependency/lockfile cleanup as part of P2.1 closure.

### Impact

Future build reports should include package-manager, Node, Java, storage, and EAS identity context.
